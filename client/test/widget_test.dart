import 'package:flutter_test/flutter_test.dart';

import 'package:client/home/home.dart';

// TODO test
void main() {
  testWidgets('Verify that the screen launches', (WidgetTester tester) async {
    await tester.pumpWidget(Home());

    // Verify that the screen launches
    expect(find.text('Sistema de Votção AEFH'), findsOneWidget);
  });
}
