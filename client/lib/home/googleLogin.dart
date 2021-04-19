import 'dart:convert';
import 'package:flutter/scheduler.dart';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import 'package:google_sign_in/google_sign_in.dart';
import '../config.dart';

// Scopes
GoogleSignIn _googleSignIn = GoogleSignIn(
  scopes: <String>['email', 'profile'],
);

class GoogleSignInButton extends StatefulWidget {
  final Function update;

  GoogleSignInButton(this.update);

  @override
  _GoogleSignInButtonState createState() => _GoogleSignInButtonState();
}

class _GoogleSignInButtonState extends State<GoogleSignInButton> {
  GoogleSignInAccount? _currentUser;
  List<String>? emails;
  bool hasWifi = true;

  @override
  void initState() {
    super.initState();

    http
        .get(Uri.parse('$apiUrl/api/v1'))
        .then((value) => {
              if (value.statusCode == 200)
                emails = _EmailsData.fromJson(jsonDecode(value.body)).emails()
              else
                throw Exception('Failed to load emails')
            })
        .then((dt) {
      _googleSignIn.onCurrentUserChanged
          .listen((GoogleSignInAccount? account) async {
        setState(() {
          _currentUser = account;
        });

        widget.update(
            [
              account != null,
              account != null && emails != null
                  ? emails![0] == account.email.split('@')[1]
                  : false
            ],
            account != null && emails != null
                ? await account.authentication.then((value) => value.idToken)
                : null);
      });

      _googleSignIn.signInSilently();
    }).onError((error, stackTrace) {
      SchedulerBinding.instance!.addPostFrameCallback(
        (_) => showDialog(
          barrierDismissible: false,
          context: context,
          builder: (_) => AlertDialog(
            title: Text('Sem Internet'),
            content: Text(
              'Por favor verifique a ligação à Internet, e de seguida reabra a aplicação.',
            ),
          ),
        ),
      );
    });
  }

  Future<void> _handleSignIn() async {
    try {
      await _googleSignIn.signIn();
    } catch (error) {
      print(error);
    }
  }

  Future<void> _handleSignOut() => _googleSignIn.disconnect();

  @override
  Widget build(BuildContext context) {
    try {
      if (emails != null &&
          !emails!.contains(_currentUser!.email.split('@')[1])) {
        _handleSignOut();

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Apenas emails institucionais são válidos!'),
            behavior: SnackBarBehavior.floating,
            width: 300,
          ),
        );
      }
    } catch (err) {}

    return OutlinedButton(
      child: Row(
        children: [
          Container(
            margin: EdgeInsets.only(
              right: 15,
              top: 5,
              bottom: 5,
            ),
            child: Image.asset(
              'assets/signInGoogle.png',
              height: 25,
            ),
          ),
          Text(_currentUser == null
              ? 'Iniciar Sessão com o Google'
              : 'Desconectar'),
        ],
      ),
      onPressed: () {
        //Navigator.pushNamed(context, '/management');
        if (_currentUser == null) {
          _handleSignIn();
        } else {
          _handleSignOut();
        }
      },
    );
  }
}

class _EmailsData {
  final int version;
  final String students;
  final String teachers;

  _EmailsData(
      {required this.version, required this.students, required this.teachers});

  factory _EmailsData.fromJson(Map<String, dynamic> json) {
    return _EmailsData(
      version: json['version'],
      students: json['students'],
      teachers: json['teachers'],
    );
  }

  List<String> emails() {
    return [teachers, students];
  }
}
