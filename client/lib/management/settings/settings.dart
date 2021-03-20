import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:flutter/scheduler.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../../config.dart';

class Settings extends StatefulWidget {
  @override
  _SettingsState createState() => _SettingsState();
}

class _SettingsState extends State<Settings> {
  var token;
  var id;
  var loading = true;
  var updating = false;

  var name;
  var type;
  var internal;
  var options;
  var allow;
  var white;

  String getType(type) {
    switch (type) {
      case 0:
        return 'PV';

      case 1:
        return 'IR';

      default:
        return 'CV';
    }
  }

  int invertType(type) {
    switch (type) {
      case 'PV':
        return 0;

      case 'IR':
        return 1;

      default:
        return 2;
    }
  }

  @override
  void initState() {
    super.initState();

    SchedulerBinding.instance!.addPostFrameCallback((timeStamp) {
      http.get(
        Uri.parse('$apiUrl/api/v1/management/settings/$id'),
        headers: <String, String>{'Authorization': 'Bearer $token'},
      ).then((response) {
        if (response.statusCode == 200) {
          var data = _SettingsData.fromJson(json.decode(response.body));

          setState(() {
            name = data.name;
            type = getType(data.type);
            internal = data.internal;
            options = data.options.map((i) => i['name']).toList();

            allow = data.allow.join(', ');

            white = options.contains('Voto em Branco');

            if (white) options.removeAt(options.indexOf('Voto em Branco'));

            loading = false;
          });
        }
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    final args =
        ModalRoute.of(context)!.settings.arguments as Map<String, dynamic>?;

    if (args == null) {
      SchedulerBinding.instance!.addPostFrameCallback((timeStamp) {
        Navigator.popUntil(context, ModalRoute.withName('/'));
      });
    } else {
      id = args['id'];
      token = args['token'];
    }

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          tooltip: 'Voltar',
          icon: Icon(Icons.arrow_back),
          onPressed: () {
            Navigator.of(context).pop();
          },
        ),
        title: Text('Definições da Votação'),
        actions: [
          IconButton(
            icon: Icon(Icons.check),
            onPressed: () {
              if (loading || updating) return;

              setState(() {
                updating = true;
              });

              var all = allow.split(new RegExp('(,| )+'));

              http
                  .patch(
                Uri.parse('$apiUrl/api/v1/management/settings/$id'),
                headers: <String, String>{
                  'Content-Type': 'application/json; charset=UTF-8',
                  'Authorization': 'Bearer $token',
                },
                body: json.encode({
                  'name': name,
                  'internal': internal,
                  'type': invertType(type),
                  'options': type == 'PV' && white
                      ? [...options, 'Voto em Branco']
                      : options,
                  'allow': all[0] != '' ? all : []
                }),
              )
                  .then((value) {
                if (value.statusCode == 200) {
                  Navigator.pushNamed(
                    context,
                    '/management/data',
                    arguments: {
                      'token': token,
                      'id': id,
                      'name': name,
                    },
                  ).catchError(() {
                    setState(() {
                      updating = false;
                    });
                  });
                }
              });
            },
            tooltip: 'Guardar',
          ),
        ],
      ),
      body: loading
          ? Align(
              alignment: Alignment.topCenter,
              child: Container(
                margin: EdgeInsets.only(top: 15),
                child: CircularProgressIndicator(),
              ),
            )
          : SingleChildScrollView(
              child: Container(
                margin: EdgeInsets.fromLTRB(10, 30, 10, 10),
                child: Column(
                  children: [
                    TextFormField(
                      autofocus: true,
                      maxLength: 30,
                      initialValue: name,
                      onChanged: (text) {
                        setState(() {
                          name = text;
                        });
                      },
                      decoration: InputDecoration(
                        border: OutlineInputBorder(),
                        labelText: 'Nome da Votação',
                      ),
                      enabled: !updating,
                    ),
                    Row(
                      children: [
                        Text('Método de Votação:'),
                        DropdownButton(
                          hint: Text('Método de Votação'),
                          value: type,
                          onChanged: (val) {
                            if (val is String && !updating)
                              setState(() {
                                type = val;
                              });
                          },
                          items: [
                            DropdownMenuItem(
                              value: 'PV',
                              child: Text('Plurality Voting'),
                            ),
                            DropdownMenuItem(
                              value: 'IR',
                              child: Text('Instant Runoff Voting'),
                            ),
                            DropdownMenuItem(
                              value: 'CV',
                              child: Text('Condorcet Method'),
                            ),
                          ],
                        ),
                        IconButton(
                          icon: Icon(
                            Icons.help_outline,
                            color: Colors.blue,
                          ),
                          onPressed: () async {
                            const url =
                                'https://www.youtube-nocookie.com/embed/PaxVCsnox_4?end=307&vq=hd1080&modestbranding=1&cc_load_policy=1&hl=pt-PT';

                            await launch(url);
                          },
                          splashRadius: 1,
                        ),
                      ],
                    ),
                    if (type == 'PV')
                      Row(
                        children: [
                          Text('Votos Brancos:'),
                          Switch(
                            value: white,
                            onChanged: (val) {
                              if (val is bool)
                                setState(() {
                                  white = val;
                                });
                            },
                          ),
                          IconButton(
                            icon: Icon(
                              Icons.help_outline,
                              color: Colors.blue,
                            ),
                            onPressed: () {
                              showDialog(
                                  context: context,
                                  builder: (context) => AlertDialog(
                                        title: Text('Votos Brancos'),
                                        content: Text(
                                          'Permite votos em branco.',
                                        ),
                                        actions: [
                                          TextButton(
                                            onPressed: () {
                                              Navigator.pop(context);
                                            },
                                            child: Text('Fechar'),
                                          ),
                                        ],
                                      ));
                            },
                            splashRadius: 1,
                          ),
                        ],
                      ),
                    Row(
                      children: [
                        Text('Votação Interna:'),
                        Switch(
                          value: internal,
                          onChanged: (val) {
                            if (val is bool && !updating)
                              setState(() {
                                internal = val;
                              });
                          },
                        ),
                        IconButton(
                          icon: Icon(
                            Icons.help_outline,
                            color: Colors.blue,
                          ),
                          onPressed: () {
                            showDialog(
                                context: context,
                                builder: (context) => AlertDialog(
                                      title: Text('Votação Interna'),
                                      content: Text(
                                        'Disponivel apenas para pessoas com email institucional.',
                                      ),
                                      actions: [
                                        TextButton(
                                            onPressed: () {
                                              Navigator.pop(context);
                                            },
                                            child: Text('Fechar')),
                                      ],
                                    ));
                          },
                          splashRadius: 1,
                        ),
                      ],
                    ),
                    // -------------------------------
                    Text('Opções:'),
                    ...options
                        .asMap()
                        .entries
                        .map(
                          (opt) => Row(
                            children: [
                              Container(
                                width: MediaQuery.of(context).size.width - 68,
                                child: TextFormField(
                                  key: Key('${options.length}${opt.key}'),
                                  maxLength: 30,
                                  initialValue: opt.value,
                                  onChanged: (text) =>
                                      setState(() => options[opt.key] = text),
                                ),
                              ),
                              IconButton(
                                icon: Icon(
                                  Icons.delete,
                                  //color: Colors.blue,
                                ),
                                onPressed: () {
                                  setState(() {
                                    options.removeAt(opt.key);
                                  });
                                },
                                splashRadius: 20,
                              ),
                            ],
                          ),
                        )
                        .toList(),
                    if (options.length < 30)
                      Container(
                        margin: EdgeInsets.all(10),
                        child: ElevatedButton(
                          child: Text('Adicionar Opção'),
                          onPressed: () => setState(
                            () => options.insert(options.length, ''),
                          ),
                        ),
                      ),
                    // ---------------------------
                    if (internal) ...{
                      Text('Emails'),
                      TextFormField(
                        initialValue: allow,
                        maxLines: null,
                        keyboardType: TextInputType.multiline,
                        maxLength: 50000,
                        decoration: InputDecoration(
                          labelText:
                              'Insira os emails separados por "," ou " "',
                        ),
                        enabled: !updating,
                        onChanged: (text) => setState(() => allow = text),
                      ),
                      Text('(Deixe em branco para aceitar qualquer email)'),
                    }
                  ],
                ),
              ),
            ),
    );
  }
}

class _SettingsData {
  final String name;
  final bool internal;
  final int type;
  final options;
  final allow;

  _SettingsData(this.name, this.internal, this.type, this.options, this.allow);

  factory _SettingsData.fromJson(Map<String, dynamic> json) {
    return _SettingsData(
      json['name'],
      json['internal'],
      json['type'],
      json['options'],
      json['allow'],
    );
  }
}
