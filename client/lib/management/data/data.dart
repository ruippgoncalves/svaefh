import 'dart:async';
import 'package:flutter/material.dart';
import 'package:charts_flutter/flutter.dart' as charts;
import 'package:vote/vote.dart';
import 'dart:convert';
import 'package:flutter/scheduler.dart';
import 'package:http/http.dart' as http;
import '../../config.dart';

import './pc.dart';
import './mobile.dart';

class Data extends StatefulWidget {
  @override
  _DataState createState() => _DataState();
}

class _DataState extends State<Data> {
  Timer? timer;
  _RTData? data;
  var token;
  var id;
  var loading = true;
  var name;
  var dataGraph;
  List<String?> podium = [null, null, null];
  var voteDt;

  @override
  void initState() {
    super.initState();

    setState(() {
      loading = true;

      if (timer != null) timer!.cancel();
    });

    SchedulerBinding.instance!.addPostFrameCallback((timeStamp) {
      loadData();
    });
  }

  @override
  void dispose() {
    timer?.cancel();
    super.dispose();
  }

  void loadData() async {
    http.get(
      Uri.parse('$apiUrl/api/v1/management/data/$id'),
      headers: <String, String>{'Authorization': 'Bearer $token'},
    ).then((response) {
      if (response.statusCode == 200) {
        setState(() {
          data = _RTData.fromJson(json.decode(response.body));

          if (data?.count is List) {
            List<_DataClass> dt = data!.count!
                .map(
                  (e) => new _DataClass(
                    DateTime.parse(e['date']),
                    e['itemCount'],
                  ),
                )
                .toList();

            dataGraph = [
              new charts.Series<_DataClass, DateTime>(
                id: 'qtdVotes',
                data: dt,
                domainFn: (data, _) => data.time,
                measureFn: (data, _) => data.val,
              )
            ];
          }

          if (data?.votes is List) {
            switch (data?.type) {
              case 0:
                var ballots = data?.votes
                    ?.map(
                      (e) => PluralityBallot(e['votes'][0]['name'] as String),
                    )
                    .toList();

                voteDt = PluralityElection(ballots);
                break;

              case 1:
                var ballots = data?.votes
                    ?.map(
                      (e) => RankedBallot((e as Iterable)
                          .map((i) => i['name'] as String)
                          .toList()),
                    )
                    .toList();

                voteDt = IrvElection(ballots);
                break;

              // case 2:
              default:
                var ballots = data?.votes
                    ?.map(
                      (e) => RankedBallot((e as Iterable)
                          .map((i) => i['name'] as String)
                          .toList()),
                    )
                    .toList();

                voteDt = CondorcetElection(ballots);
            }

            podium = [null, null, null];

            for (var item in voteDt.places) {
              if (item.place > 3) break;

              if (item.length > 1) {
                continue;
              }

              podium[item.place - 1] = item[0];
            }
          }

          loading = false;
        });

        if (timer == null && data?.state == 1)
          timer =
              Timer.periodic(Duration(seconds: 15), (Timer t) => loadData());
      }
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
      name = args['name'];
    }

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          tooltip: 'Voltar',
          icon: Icon(Icons.arrow_back),
          onPressed: () {
            Navigator.of(context).popUntil(ModalRoute.withName('/management'));
          },
        ),
        title: Text(name != null ? name : ''),
        actions: [
          if (data != null && data!.state != 2)
            IconButton(
              tooltip:
                  data!.state == 1 ? 'Finalizar Votação' : 'Iniciar Votação',
              icon: Icon(data!.state == 1 ? Icons.stop : Icons.play_arrow),
              onPressed: () {
                http.post(
                  Uri.parse('$apiUrl/api/v1/management/data/$id'),
                  headers: <String, String>{'Authorization': 'Bearer $token'},
                ).then((value) {
                  if (data!.state == 1) timer?.cancel();

                  Navigator.pushNamed(
                    context,
                    '/management/data',
                    arguments: {
                      'token': token,
                      'id': id,
                      'name': name,
                    },
                  );
                });
              },
            ),
          if (data != null && data!.state == 2 && data!.type == 0)
            IconButton(
              tooltip: 'Baixar Dados',
              icon: Icon(Icons.file_download),
              onPressed: () {
                var cnt = (voteDt.places as Iterable)
                    .map((i) => {
                          'position': '${i.place}',
                          'opt': i.toList().map((i) => i.toString()).join(', '),
                          'voteCount': '${i.voteCount}'
                        })
                    .toList();

                Navigator.pushNamed(
                  context,
                  '/management/data/export',
                  arguments: {'content': cnt, 'title': name},
                );
              },
            ),
          if (data != null && data!.state == 0)
            IconButton(
              tooltip: 'Definições',
              icon: Icon(Icons.settings),
              onPressed: () {
                Navigator.pushNamed(
                  context,
                  '/management/settings',
                  arguments: {
                    'token': token,
                    'id': id,
                  },
                );
              },
            ),
          IconButton(
            tooltip: 'Apagar Votação',
            icon: Icon(Icons.delete),
            onPressed: () {
              showDialog(
                  context: context,
                  builder: (context) => AlertDialog(
                        title: Text('Apagar Votação'),
                        content: Text(
                          'Tem certeza que pretende apagar esta votação.',
                        ),
                        actions: [
                          TextButton(
                            onPressed: () {
                              Navigator.pop(context);
                            },
                            child: Text('Cancelar'),
                          ),
                          TextButton(
                            onPressed: () {
                              http.delete(
                                Uri.parse(
                                  '$apiUrl/api/v1/management/settings/$id',
                                ),
                                headers: <String, String>{
                                  'Authorization': 'Bearer $token'
                                },
                              ).then((value) {
                                if (value.statusCode == 200)
                                  Navigator.popUntil(
                                    context,
                                    ModalRoute.withName('/management'),
                                  );
                              });
                            },
                            child: Text('Apagar'),
                          ),
                        ],
                      ));
            },
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
          : data!.state == 0
              ? Align(
                  alignment: Alignment.topCenter,
                  child: Container(
                    margin: EdgeInsets.all(15),
                    child: Text(
                      'Inicie a votação para a acompanhar em tempo real! (Necessita de pelo menos uma opção para iniciar)',
                      textAlign: TextAlign.center,
                    ),
                  ),
                )
              : OrientationBuilder(
                  builder: (context, orientation) {
                    return MediaQuery.of(context).size.width > 992 &&
                            orientation == Orientation.landscape
                        ? Pc(
                            code: data?.code,
                            data: dataGraph,
                            podium: podium,
                          )
                        : Mobile(
                            code: data?.code,
                            data: dataGraph,
                            podium: podium,
                          );
                  },
                ),
    );
  }
}

class _DataClass {
  final DateTime time;
  final int val;

  _DataClass(this.time, this.val);
}

class _RTData {
  final String? code;
  final List? votes;
  final List? count;
  final int state;
  final int? type;

  _RTData({this.code, this.votes, this.count, required this.state, this.type});

  factory _RTData.fromJson(Map<String, dynamic> json) {
    return _RTData(
      code: json['code'],
      votes: json['votes'],
      count: json['count'],
      state: json['state'],
      type: json['type'],
    );
  }
}
