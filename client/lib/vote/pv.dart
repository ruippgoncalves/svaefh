import 'package:flutter/material.dart';

class PvVote extends StatefulWidget {
  final List options;
  final Function onChanged;

  PvVote(this.options, this.onChanged);

  @override
  _PvVoteState createState() => _PvVoteState(options[0]['_id']);
}

class _PvVoteState extends State<PvVote> {
  var _selected;

  _PvVoteState(this._selected);

  storeVal(val) {
    setState(() {
      _selected = val;
    });

    widget.onChanged(val);
  }

  @override
  Widget build(BuildContext context) {
    return Scrollbar(
      child: SingleChildScrollView(
        child: Column(
          children: [
            Container(
              child: Text(
                'Opções da Votação',
                style: Theme.of(context).textTheme.headline5,
                textAlign: TextAlign.center,
              ),
              width: double.infinity,
              margin: const EdgeInsets.all(10),
            ),
            Column(
              children: widget.options
                  .map((option) => ListTile(
                        title: Text(option['name']),
                        leading: Radio(
                          value: option['_id'],
                          groupValue: _selected,
                          onChanged: storeVal,
                        ),
                      ))
                  .toList(),
            ),
          ],
        ),
      ),
    );
  }
}
