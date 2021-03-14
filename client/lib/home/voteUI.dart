import 'dart:async';
import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:uni_links/uni_links.dart';
import 'package:flutter/services.dart' show PlatformException;
import 'package:flutter/foundation.dart' show kIsWeb;
import '../config.dart';

import './qrReader.dart';

class VoteUI extends StatefulWidget {
  final logged;
  final String? token;

  VoteUI(this.logged, this.token);

  @override
  _VoteUIState createState() => _VoteUIState();
}

class _VoteUIState extends State<VoteUI> {
  final _regExVer = new RegExp('[a-fA-f0-9]{4}');

  var loading = false;
  var code = '';
  var extCode = false;

  @override
  initState() {
    super.initState();

    if (!kIsWeb) {
      initUniLinks().then((value) => null);
    }
  }

  Future<String?> initUniLinks() async {
    try {
      String link = await getInitialLink();

      readCodeFromString(link);
    } on PlatformException {
      return null;
    }
  }

  void readCodeFromString(String link) {
    List<String> cd = link.split('=');

    if (cd.length == 2 && cd[1].contains(_regExVer)) {
      setState(() {
        code = cd[1];
        extCode = true;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        TextFormField(
          key: Key(extCode ? 'code' : 'extCode'),
          initialValue: code,
          decoration: InputDecoration(
            labelText: 'Código da Votação',
          ),
          autofocus: true,
          maxLength: 4,
          onChanged: (text) => setState(() => {code = text}),
          enabled: !loading,
        ),
        if (!kIsWeb)
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              child: Text('Ler Código QR'),
              onPressed: () async {
                setState(() {
                  code = '';
                  extCode = false;
                });

                final result = await Navigator.push(context,
                    MaterialPageRoute(builder: (context) => QRReader()));

                if (result != null)
                  setState(() {
                    code = result;
                    extCode = true;
                  });
              },
            ),
          ),
        SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            child: loading
                ? Container(
                    height: 20,
                    width: 20,
                    child: CircularProgressIndicator(
                      valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                      strokeWidth: 2,
                    ),
                  )
                : widget.logged[0] && widget.logged[1] && code.length != 4
                    ? Text('Gerir Votações')
                    : Text('Votar'),
            onPressed: () {
              if (loading) return;

              if (widget.logged[0] && widget.logged[1] && code.length != 4) {
                Navigator.pushNamed(context, '/management',
                    arguments: {'token': widget.token});

                return;
              }

              // Vote
              if (!code.contains(_regExVer)) {
                showDialog(
                  context: context,
                  builder: (_) => AlertDialog(
                    title: Text('Código Inválido'),
                    content: Text(
                        'O código inserido é inválido, por favor insira outro!'),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(context),
                        child: Text('Ok'),
                      ),
                    ],
                  ),
                );

                return;
              }

              setState(() {
                loading = true;
              });

              http.get(
                Uri.parse('$apiUrl/api/v1/vote/$code'),
                headers: <String, String>{
                  'Authorization':
                      widget.token != null ? 'Bearer ${widget.token}' : ''
                },
              ).then((value) {
                if (value.statusCode == 404) {
                  showDialog(
                    context: context,
                    builder: (_) => AlertDialog(
                      title: Text('Votação não Encontrada'),
                      content: Text(
                          'O código inserido não foi encontrado, por favor insira outro!'),
                      actions: [
                        TextButton(
                          onPressed: () => Navigator.pop(context),
                          child: Text('Ok'),
                        ),
                      ],
                    ),
                  );

                  setState(() {
                    loading = false;
                  });
                } else {
                  var data = _PollData.fromJson(jsonDecode(value.body));

                  if (!data.canVote()) {
                    showDialog(
                      context: context,
                      builder: (_) => AlertDialog(
                        title: Text('Operação Inválida'),
                        content: Text(
                            'Verifique o email e validade no acesso à votação!'),
                        actions: [
                          TextButton(
                            onPressed: () {
                              Navigator.pop(context);
                              setState(() {
                                loading = false;
                              });
                            },
                            child: Text('Ok'),
                          ),
                        ],
                      ),
                    );
                  } else {
                    setState(() {
                      loading = false;
                    });

                    Navigator.pushNamed(context, '/vote', arguments: {
                      'code': code,
                      'name': data.name,
                      'type': data.type,
                      'options': data.options,
                      'token': widget.token
                    });
                  }
                }
              });
            },
          ),
        ),
      ],
    );
  }
}

class _PollData {
  final String name;
  final num type;
  final List options;
  final bool vote;

  _PollData(
      {required this.name,
      required this.type,
      required this.options,
      required this.vote});

  factory _PollData.fromJson(Map<String, dynamic> json) {
    return _PollData(
        name: json['name'],
        type: json['type'],
        options: json['options'],
        vote: json['vote']);
  }

  bool canVote() {
    return vote;
  }
}
