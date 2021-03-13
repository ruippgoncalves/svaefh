import 'package:client/config.dart';
import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../../../config.dart';

class QrCode extends StatelessWidget {
  final code;
  final bool pc;

  QrCode(this.code, this.pc);

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Container(
        child: Column(
          children: [
            Text(
              code != null ? 'Código: $code' : 'Código: ----',
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.headline5,
            ),
            code != null
                ? QrImage(
                    data: '$apiUrl/api/v1/redirect?code=$code',
                    embeddedImage: AssetImage('assets/icon.png'),
                    embeddedImageStyle: QrEmbeddedImageStyle(
                        size: pc
                            ? Size(MediaQuery.of(context).size.height * 0.06,
                                MediaQuery.of(context).size.height * 0.06)
                            : Size(MediaQuery.of(context).size.width * 0.16,
                                MediaQuery.of(context).size.width * 0.16)),
                  )
                : Container(
                    width: double.infinity,
                    child: AspectRatio(
                      aspectRatio: 1,
                      child: Center(
                        child: Text('Votação Finalizada!'),
                      ),
                    ),
                  ),
          ],
        ),
        padding: EdgeInsets.all(30),
      ),
    );
  }
}
