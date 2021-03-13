import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import './googleLogin.dart';
import './voteUI.dart';

class Home extends StatefulWidget {
  @override
  _HomeState createState() => _HomeState();
}

class _HomeState extends State<Home> {
  var logged = [false, false];
  var token;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Scrollbar(
        child: SingleChildScrollView(
          child: Container(
            width: double.infinity,
            height: MediaQuery.of(context).size.height,
            constraints: BoxConstraints(minHeight: 450),
            decoration: BoxDecoration(
              image: DecorationImage(
                image: AssetImage("assets/school.jpg"),
                fit: BoxFit.cover,
              ),
            ),
            child: Center(
              child: Container(
                height: 405,
                child: Stack(
                  children: [
                    Column(
                      children: [
                        SizedBox(
                          height: 62.5,
                        ),
                        Container(
                          padding: EdgeInsets.only(right: 10, left: 10),
                          constraints:
                              BoxConstraints(maxWidth: 400, minWidth: 320),
                          width: double.infinity,
                          child: Card(
                            elevation: 8,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Container(
                              padding: EdgeInsets.fromLTRB(10, 72.5, 10, 10),
                              child: Column(
                                children: [
                                  Container(
                                    margin: EdgeInsets.only(bottom: 10),
                                    child: Text(
                                      'Sistema de Votção AEFH',
                                      textAlign: TextAlign.center,
                                      style:
                                          Theme.of(context).textTheme.headline4,
                                    ),
                                  ),
                                  GoogleSignInButton(
                                    (dt, tk) => setState(
                                        () => {logged = dt, token = tk}),
                                  ),
                                  VoteUI(logged, token),
                                  Container(
                                    margin: EdgeInsets.only(top: 10),
                                    child: GestureDetector(
                                      onTap: () async {
                                        const url =
                                            'https://github.com/ruippgoncalves/svaefh';

                                        if (await canLaunch(url)) {
                                          await launch(url);
                                        } else {
                                          throw 'Could not launch $url';
                                        }
                                      },
                                      child: Text('© AEFH e Rui Gonçalves'),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                    Container(
                      padding: EdgeInsets.only(right: 10, left: 10),
                      constraints: BoxConstraints(maxWidth: 400, minWidth: 320),
                      child: Row(
                        children: [
                          Spacer(flex: 1),
                          Flexible(
                            flex: 1,
                            child: Container(
                              child: Material(
                                elevation: 32,
                                borderRadius: BorderRadius.circular(200),
                                child: ClipRRect(
                                  borderRadius: BorderRadius.circular(200),
                                  child: Image.asset(
                                    'assets/icon.png',
                                  ),
                                ),
                              ),
                            ),
                          ),
                          Spacer(flex: 1),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
