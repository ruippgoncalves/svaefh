import 'package:flutter/material.dart';

// Home
import './home/home.dart';
import './vote/vote.dart';
import './management/management.dart';
import './management/data/data.dart';
import './management/data/pdf/dataPdf.dart';
import './management/settings/settings.dart';

// Starts the App
void main() {
  runApp(SVAEFH());
}

// Main App Widget
class SVAEFH extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Sistema de Votacão AEFH',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      routes: {
        '/': (context) => Home(),
        '/vote': (context) => Vote(),
        '/management': (context) => Management(),
        '/management/data': (context) => Data(),
        '/management/data/export': (context) => DataPdf(),
        '/management/settings': (context) => Settings(),
      },
      initialRoute: '/',
      debugShowCheckedModeBanner: false,
    );
  }
}
