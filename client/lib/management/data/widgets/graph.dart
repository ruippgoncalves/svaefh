import 'package:flutter/material.dart';
import 'package:charts_flutter/flutter.dart' as charts;

class Graph extends StatelessWidget {
  final data;

  Graph(this.data);

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Container(
        child: Column(
          children: [
            Text(
              'Ritmo de Votos',
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.headline5,
            ),
            AspectRatio(
              aspectRatio: 1,
              child: charts.TimeSeriesChart(
                data,
                animate: true,
                domainAxis: new charts.EndPointsTimeAxisSpec(),
              ),
            ),
          ],
        ),
        padding: EdgeInsets.all(30),
      ),
    );
  }
}
