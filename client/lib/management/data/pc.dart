import 'package:flutter/material.dart';

import './widgets/qrcode.dart';
import './widgets/graph.dart';
import './widgets/vote.dart';

class Pc extends StatelessWidget {
  final code;
  final data;
  final podium;

  Pc({required this.code, required this.data, required this.podium});

  @override
  Widget build(BuildContext context) {
    var padding = MediaQuery.of(context).padding;
    double heightNotSafe = MediaQuery.of(context).size.height;
    double height = heightNotSafe - padding.top - padding.bottom;

    return Row(
      children: [
        SizedBox(
          height: double.infinity,
          child: AspectRatio(
            aspectRatio: height * 0.0000444 + 0.4254888,
            child: Column(
              children: [
                QrCode(code, true),
                Graph(data),
              ],
            ),
          ),
        ),
        Vote(true, podium),
      ],
    );
  }
}
