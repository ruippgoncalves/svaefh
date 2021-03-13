import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../config.dart';

import './pv.dart';
import './ir.dart';
import './help.dart';

class Vote extends StatefulWidget {
  @override
  _VoteState createState() => _VoteState();
}

class _VoteState extends State<Vote> {
  var opts = [];

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

  @override
  Widget build(BuildContext context) {
    final args =
        ModalRoute.of(context)!.settings.arguments as Map<String, dynamic>?;

    if (args == null) {
      SchedulerBinding.instance!.addPostFrameCallback((timeStamp) {
        Navigator.popUntil(context, ModalRoute.withName('/'));
      });
    } else {
      if (args['type'] == 0) {
        opts = [
          {'opt': args['options'][0]['_id']}
        ];
      } else {
        opts = args['options']
            .asMap()
            .entries
            .map((i) => {'opt': i.value['_id'], 'ir': i.key});
      }
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
        title: Text(args!['name']),
        actions: [
          IconButton(
            icon: Icon(Icons.send),
            onPressed: () {
              var code = args['code'];
              var token = args['token'] ?? '';
              Navigator.of(context).pop();

              http
                  .post(Uri.parse('$apiUrl/api/v1/vote/$code'),
                      headers: <String, String>{
                        'Content-Type': 'application/json; charset=UTF-8',
                        'Authorization':
                            args['token'] != null ? 'Bearer $token' : ''
                      },
                      body: jsonEncode({'vote': opts}))
                  .then((value) {
                if (value.statusCode == 200) {
                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                    content: Text('Votou com sucesso!'),
                    behavior: SnackBarBehavior.floating,
                    width: 300,
                  ));
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                    content: Text('Ocorreu um erro!'),
                    behavior: SnackBarBehavior.floating,
                    width: 300,
                  ));
                }
              });
            },
            tooltip: 'Enviar',
          ),
          HelpBtn(getType(args['type'])),
        ],
      ),
      body: args['type'] == 0
          ? PvVote(args['options'], (val) {
              opts = [
                {'opt': val}
              ];
            })
          : IrVote(args['options'], (vals) {
              opts = vals
                  .asMap()
                  .entries
                  .map((i) => {'opt': i.value, 'ir': i.key});
            }),
    );
  }
}
