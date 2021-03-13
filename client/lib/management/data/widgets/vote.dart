import 'package:flutter/material.dart';

class Vote extends StatelessWidget {
  final bool pc;
  final List<String?> podium;

  Vote(this.pc, this.podium);

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
              Container(
                margin: EdgeInsetsDirectional.only(top: 30),
                child: Row(
                  children: [
                    Spacer(
                      flex: 3,
                    ),
                    Expanded(
                      flex: 2,
                      child: Text(
                        podium[1] ?? '',
                        overflow: TextOverflow.ellipsis,
                        textAlign: TextAlign.center,
                        style: Theme.of(context).textTheme.headline6,
                      ),
                    ),
                    Spacer(
                      flex: 1,
                    ),
                    Expanded(
                      flex: 2,
                      child: Text(
                        podium[0] ?? '',
                        overflow: TextOverflow.ellipsis,
                        textAlign: TextAlign.center,
                        style: Theme.of(context).textTheme.headline6,
                      ),
                    ),
                    Spacer(
                      flex: 1,
                    ),
                    Expanded(
                      flex: 2,
                      child: Text(
                        podium[2] ?? '',
                        overflow: TextOverflow.ellipsis,
                        textAlign: TextAlign.center,
                        style: Theme.of(context).textTheme.headline6,
                      ),
                    ),
                    Spacer(
                      flex: 3,
                    ),
                  ],
                ),
              ),
              if (pc)
                Expanded(
                  //height: double.infinity,
                  child: Align(
                    alignment: Alignment.bottomCenter,
                    child: Image.asset('assets/podium.jpg'),
                  ),
                )
              else
                Image.asset('assets/podium.jpg'),
            ],
          ),
        ),
      ),
    );
  }
}
