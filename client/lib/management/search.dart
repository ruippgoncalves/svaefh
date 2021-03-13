import 'package:flutter/material.dart';

class Search extends SearchDelegate {
  final List<dynamic> listSearch;
  final String token;

  Search(this.listSearch, this.token);

  @override
  String? get searchFieldLabel => 'Pesquisar';

  @override
  List<Widget> buildActions(BuildContext context) {
    return <Widget>[
      IconButton(
        icon: Icon(Icons.close),
        tooltip: 'Apagar',
        onPressed: () {
          query = '';
        },
      ),
    ];
  }

  @override
  Widget buildLeading(BuildContext context) {
    return IconButton(
      icon: Icon(Icons.arrow_back),
      tooltip: 'Fechar',
      onPressed: () {
        Navigator.pop(context);
      },
    );
  }

  // Just to furfill the class
  @override
  Widget buildResults(BuildContext context) {
    return Container();
  }

  @override
  Widget buildSuggestions(BuildContext context) {
    List suggestionList = [];
    query.isEmpty
        ? suggestionList = listSearch
        : suggestionList.addAll(listSearch.where(
            (element) =>
                element['name'].toLowerCase().contains(query.toLowerCase()),
          ));

    return ListView.builder(
      itemCount: suggestionList.length,
      itemBuilder: (context, index) {
        return ListTile(
          title: Text(
            suggestionList[index]['name'],
          ),
          onTap: () {
            Navigator.pushNamed(
              context,
              '/management/data',
              arguments: {
                'token': token,
                'id': suggestionList[index]['id'],
                'name': suggestionList[index]['name']
              },
            );
          },
        );
      },
    );
  }
}
