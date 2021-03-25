import 'package:flutter/material.dart';

class IrVote extends StatefulWidget {
  final List options;
  final Function onChanged;

  IrVote(this.options, this.onChanged);

  @override
  _IrVoteState createState() => _IrVoteState(options);
}

class _IrVoteState extends State<IrVote> {
  final options;

  _IrVoteState(options) : this.options = [...options];

  void _updateItems(int oldIndex, int newIndex) {
    setState(() {
      if (newIndex > oldIndex) {
        newIndex -= 1;
      }

      final item = options.removeAt(oldIndex);
      options.insert(newIndex, item);
    });

    widget.onChanged(options.map((item) => item['_id']));
  }

  @override
  Widget build(BuildContext context) {
    return Scrollbar(
      child: ReorderableListView(
        padding: MediaQuery.of(context).size.width < 600
            ? EdgeInsets.only()
            : EdgeInsets.only(
                left: MediaQuery.of(context).size.width / 4,
                right: MediaQuery.of(context).size.width / 4,
              ),
        header: Container(
          child: Text(
            'Opções da Votação',
            style: Theme.of(context).textTheme.headline5,
            textAlign: TextAlign.center,
          ),
          width: double.infinity,
          margin: const EdgeInsets.all(10),
        ),
        onReorder: _updateItems,
        children: options
            .map<Widget>(
              (option) => Card(
                key: Key(option['_id']),
                margin: EdgeInsets.all(8),
                color: Colors.white,
                child: InkWell(
                  splashColor: Colors.blue,
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: <Widget>[
                      Flexible(
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: <Widget>[
                            Container(
                              padding: EdgeInsets.fromLTRB(
                                12,
                                12,
                                30,
                                12,
                              ),
                              alignment: Alignment.topLeft,
                              child: Text(
                                option['name'],
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                ),
                                textAlign: TextAlign.left,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            )
            .toList(),
      ),
    );
  }
}
