import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config.dart';

// TODO qrcode and unilink
class VoteUI extends StatefulWidget {
  final logged;
  final String? token;

  VoteUI(this.logged, this.token);

  @override
  _VoteUIState createState() => _VoteUIState();
}

class _VoteUIState extends State<VoteUI> {
  var loading = false;
  var code = '';

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        TextField(
          decoration: InputDecoration(
            labelText: 'Código da Votação',
          ),
          autofocus: true,
          maxLength: 4,
          onChanged: (text) => setState(() => {code = text}),
          enabled: !loading,
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
              if (!code.contains(new RegExp('[a-fA-f0-9]{4}'))) {
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
