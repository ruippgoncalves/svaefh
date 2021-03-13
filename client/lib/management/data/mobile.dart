import 'package:flutter/material.dart';

import './widgets/qrcode.dart';
import './widgets/graph.dart';
import './widgets/vote.dart';

class Mobile extends StatelessWidget {
  final code;
  final data;
  final podium;

  Mobile({required this.code, required this.data, required this.podium});

  @override
  Widget build(BuildContext context) {
    return Scrollbar(
      child: SingleChildScrollView(
        child: Column(
          children: [
            QrCode(code, false),
            Graph(data),
            Row(
              children: [
                Vote(false, podium),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
