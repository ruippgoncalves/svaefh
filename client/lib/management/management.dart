import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';
import 'dart:convert';
import '../config.dart';

import './search.dart';

class Management extends StatefulWidget {
  final DateFormat formatter = DateFormat('dd/MM/yyyy');

  @override
  _ManagementState createState() => _ManagementState();
}

class _ManagementState extends State<Management> {
  var token;
  var ascending = false;
  var colIndex;
  var loading = true;

  var dataSorted = [];
  var creating = false;

  @override
  initState() {
    super.initState();

    SchedulerBinding.instance!.addPostFrameCallback((timeStamp) {
      ldData();
    });
  }

  ldData() {
    setState(() {
      ascending = false;
      colIndex = null;
      loading = true;
    });

    http.get(
      Uri.parse('$apiUrl/api/v1/management'),
      headers: <String, String>{'Authorization': 'Bearer $token'},
    ).then((response) {
      if (response.statusCode == 200) {
        setState(() {
          dataSorted = _ManagementData.fromJson(json.decode(response.body))
              .polls
              .map<Map<String, String>>((i) => {
                    'id': i['_id'] as String,
                    'name': i['name'] as String,
                    'state': toState(i['state'] as int),
                    'createdAt': i['createdAt'] as String
                  })
              .toList();

          loading = false;
        });
      }
    });
  }

  String toState(int s) {
    switch (s) {
      case 0:
        return 'Criada';

      case 1:
        return 'Iniciada';

      // case 2:
      default:
        return 'Finalizada';
    }
  }

  onSortColum(int columnIndex, bool ascendingSort) {
    var colName;

    switch (columnIndex) {
      case 0:
        colName = 'name';
        break;
      case 1:
        colName = 'state';
        break;
      case 2:
        colName = 'createdAt';
        break;
    }

    if (ascendingSort) {
      dataSorted.sort((a, b) => b[colName]!.compareTo(a[colName]!));
    } else {
      dataSorted.sort((a, b) => a[colName]!.compareTo(b[colName]!));
    }

    colIndex = columnIndex;
    ascending = ascendingSort;
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
        title: Text('Gestão de Votações'),
        actions: [
          IconButton(
            icon: Icon(Icons.search),
            color: Colors.white,
            onPressed: () {
              showSearch(context: context, delegate: Search(dataSorted, token))
                  .then((value) => ldData());
            },
            tooltip: 'Pesquisar',
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        child: Icon(Icons.add),
        tooltip: 'Criar',
        onPressed: () {
          if (creating) return;

          setState(() {
            creating = true;
          });

          http.post(
            Uri.parse('$apiUrl/api/v1/management'),
            headers: <String, String>{'Authorization': 'Bearer $token'},
          ).then((response) {
            if (response.statusCode == 200) {
              var id = _CreateData.fromJson(json.decode(response.body)).id;

              Navigator.pushNamed(context, '/management/settings', arguments: {
                'id': id,
                'token': token,
              }).then((value) {
                ldData();

                setState(() {
                  creating = false;
                });
              });
            } else {
              showDialog(
                context: context,
                builder: (_) => AlertDialog(
                  title: Text('Ocorreu um Erro!'),
                  content: Text('Por favor tente novamente mais tarde...'),
                  actions: [
                    TextButton(
                      onPressed: () {
                        Navigator.pop(context);
                      },
                      child: Text('Ok'),
                    ),
                  ],
                ),
              );
            }
          });
        },
      ),
      body: loading
          ? Align(
              alignment: Alignment.topCenter,
              child: Container(
                margin: EdgeInsets.only(top: 15),
                child: CircularProgressIndicator(),
              ),
            )
          : Scrollbar(
              child: SingleChildScrollView(
                child: Column(
                  children: [
                    Container(
                      width: double.infinity,
                      child: Text(
                        'Votações Disponiveis',
                        style: Theme.of(context).textTheme.headline5,
                        textAlign: TextAlign.center,
                      ),
                      margin: const EdgeInsets.all(10),
                    ),
                    Container(
                      margin: const EdgeInsets.only(
                        bottom: 10,
                      ),
                      child: DataTable(
                        columnSpacing: 25.0,
                        sortAscending: ascending,
                        sortColumnIndex: colIndex,
                        showCheckboxColumn: false,
                        columns: [
                          DataColumn(
                            label: Text(
                              'Nome',
                              style: TextStyle(fontStyle: FontStyle.italic),
                            ),
                            onSort: (int columnIndex, bool ascending) {
                              setState(() {
                                onSortColum(columnIndex, ascending);
                              });
                            },
                          ),
                          DataColumn(
                            label: Text(
                              'Estado',
                              style: TextStyle(fontStyle: FontStyle.italic),
                            ),
                            onSort: (int columnIndex, bool ascending) {
                              setState(() {
                                onSortColum(columnIndex, ascending);
                              });
                            },
                          ),
                          DataColumn(
                            label: Text(
                              'Criada a',
                              style: TextStyle(fontStyle: FontStyle.italic),
                            ),
                            onSort: (int columnIndex, bool ascending) {
                              setState(() {
                                onSortColum(columnIndex, ascending);
                              });
                            },
                          ),
                        ],
                        rows: dataSorted
                            .map<DataRow>((itemRow) => DataRow(
                                    onSelectChanged: (sel) {
                                      if (sel ?? false) {
                                        Navigator.pushNamed(
                                          context,
                                          '/management/data',
                                          arguments: {
                                            'token': token,
                                            'id': itemRow['id'],
                                            'name': itemRow['name']
                                          },
                                        ).then((value) => ldData());
                                      }
                                    },
                                    cells: [
                                      DataCell(
                                        Container(
                                          child: Text(
                                            itemRow['name'] as String,
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                          width: MediaQuery.of(context)
                                                  .size
                                                  .width /
                                              4,
                                        ),
                                      ),
                                      DataCell(
                                        Text(itemRow['state'] as String),
                                      ),
                                      DataCell(
                                        Text(
                                          widget.formatter.format(
                                            DateTime.parse(itemRow['createdAt']
                                                    as String)
                                                .toUtc(),
                                          ),
                                        ),
                                      ),
                                    ]))
                            .toList(),
                      ),
                    ),
                  ],
                ),
              ),
            ),
    );
  }
}

class _ManagementData {
  final polls;

  _ManagementData(this.polls);

  factory _ManagementData.fromJson(Map<String, dynamic> json) {
    return _ManagementData(json['data']);
  }
}

class _CreateData {
  final id;

  _CreateData(this.id);

  factory _CreateData.fromJson(Map<String, dynamic> json) {
    return _CreateData(json['_id']);
  }
}
