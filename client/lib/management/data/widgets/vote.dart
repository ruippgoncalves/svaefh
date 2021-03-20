import 'package:flutter/material.dart';

class Vote extends StatelessWidget {
  final bool pc;
  final List<String?> podium;

  Vote(this.pc, this.podium);

  Widget _podiumVote(BuildContext context) {
    return Stack(
      children: [
        Image.asset('assets/podium.png'),
        AspectRatio(
          aspectRatio: 2.0157,
          child: Column(
            children: [
              Spacer(flex: 2),
              Row(
                children: [
                  Spacer(flex: 2),
                  Expanded(
                    flex: 1,
                    child: Container(
                      margin: EdgeInsets.only(left: 10, right: 10),
                      child: Text(
                        podium[0] ?? '',
                        overflow: TextOverflow.ellipsis,
                        textAlign: TextAlign.center,
                        style: Theme.of(context).textTheme.headline6,
                      ),
                    ),
                  ),
                  Spacer(flex: 2),
                ],
              ),
              Spacer(flex: 2),
              Row(
                children: [
                  Spacer(flex: 1),
                  Expanded(
                    flex: 1,
                    child: Container(
                      margin: EdgeInsets.only(left: 10, right: 10),
                      child: Text(
                        podium[1] ?? '',
                        overflow: TextOverflow.ellipsis,
                        textAlign: TextAlign.center,
                        style: Theme.of(context).textTheme.headline6,
                      ),
                    ),
                  ),
                  Spacer(flex: 3),
                ],
              ),
              Spacer(flex: 3),
              Row(
                children: [
                  Spacer(flex: 3),
                  Expanded(
                    flex: 1,
                    child: Container(
                      margin: EdgeInsets.only(left: 10, right: 10),
                      child: Text(
                        podium[2] ?? '',
                        overflow: TextOverflow.ellipsis,
                        textAlign: TextAlign.center,
                        style: Theme.of(context).textTheme.headline6,
                      ),
                    ),
                  ),
                  Spacer(flex: 1),
                ],
              ),
              Spacer(flex: 5),
            ],
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Card(
        child: Container(
          width: double.infinity,
          child: Column(
            children: [
              Container(
                margin: EdgeInsets.only(top: 30),
                child: Text(
                  'Podium',
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.headline5,
                ),
              ),
              if (pc)
                Expanded(
                  //height: double.infinity,
                  child: Align(
                    alignment: Alignment.bottomCenter,
                    child: _podiumVote(context),
                  ),
                )
              else
                _podiumVote(context)
            ],
          ),
        ),
      ),
    );
  }
}
