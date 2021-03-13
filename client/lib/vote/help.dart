import 'package:flutter/material.dart';

class HelpBtn extends StatelessWidget {
  late final String title;
  late final String help;

  HelpBtn(String type) {
    switch (type) {
      case 'PV':
        this.title = 'Pluralidade de Votos';
        this.help = 'Selecione uma opção e carregue em enviar!';
        break;

      case 'IR':
        this.title = 'Votação Classificada';
        this.help =
            'Reordene por ordem de preferencia as opções (arrastando-as) e carregue em enviar!';
        break;

      case 'CV':
        this.title = 'Votação pelo Método de Condorcet';
        this.help =
            'Reordene por ordem de preferencia as opções (arrastando-as) e carregue em enviar!';
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    return IconButton(
        tooltip: 'Ajuda',
        icon: Icon(Icons.help),
        onPressed: () {
          showDialog(
              context: context,
              builder: (context) => AlertDialog(
                    title: Text(title),
                    content: Text(help),
                    actions: [
                      TextButton(
                          onPressed: () {
                            Navigator.pop(context);
                          },
                          child: Text('Fechar')),
                    ],
                  ));
        });
  }
}
