import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';

class DataPdf extends StatefulWidget {
  @override
  _DataPdfState createState() => _DataPdfState();
}

class _DataPdfState extends State<DataPdf> {
  var title = '';

  var content;

  Future<Uint8List> _generatePdf(PdfPageFormat format, String title) {
    final pdf = pw.Document();

    pdf.addPage(
      pw.Page(
        pageFormat: format,
        build: (context) {
          return pw.Column(
            children: [
              pw.Text(title, style: pw.TextStyle(fontSize: 30)),
              pw.Container(
                margin: pw.EdgeInsets.all(30),
                child: pw.Table(
                  border: pw.TableBorder(
                    left:
                        pw.BorderSide(color: PdfColor.fromHex('000'), width: 1),
                    top:
                        pw.BorderSide(color: PdfColor.fromHex('000'), width: 1),
                    right:
                        pw.BorderSide(color: PdfColor.fromHex('000'), width: 1),
                    bottom:
                        pw.BorderSide(color: PdfColor.fromHex('000'), width: 1),
                    horizontalInside:
                        pw.BorderSide(color: PdfColor.fromHex('000'), width: 1),
                    verticalInside:
                        pw.BorderSide(color: PdfColor.fromHex('000'), width: 1),
                  ),
                  children: [
                    pw.TableRow(
                      children: [
                        pw.Row(
                          children: [
                            pw.Container(
                              margin: pw.EdgeInsets.only(left: 5),
                              child: pw.Text('Posição'),
                            ),
                          ],
                        ),
                        pw.Row(
                          children: [
                            pw.Container(
                              margin: pw.EdgeInsets.only(left: 5),
                              child: pw.Text('Opção'),
                            ),
                          ],
                        ),
                        pw.Row(
                          children: [
                            pw.Container(
                              margin: pw.EdgeInsets.only(left: 5),
                              child: pw.Text('Quantidade de Votos'),
                            ),
                          ],
                        ),
                      ],
                    ),
                    ...(content as Iterable)
                        .map((cnt) => pw.TableRow(children: [
                              pw.Row(
                                children: [
                                  pw.Container(
                                    margin: pw.EdgeInsets.only(left: 5),
                                    child: pw.Text(cnt['position']),
                                  ),
                                ],
                              ),
                              pw.Row(
                                children: [
                                  pw.Container(
                                    margin: pw.EdgeInsets.only(left: 5),
                                    child: pw.Text(cnt['opt']),
                                  ),
                                ],
                              ),
                              pw.Row(
                                children: [
                                  pw.Container(
                                    margin: pw.EdgeInsets.only(left: 5),
                                    child: pw.Text(cnt['voteCount']),
                                  ),
                                ],
                              ),
                            ]))
                        .toList()
                  ],
                ),
              ),
            ],
          );
        },
      ),
    );

    return pdf.save();
  }

  @override
  Widget build(BuildContext context) {
    final args =
        ModalRoute.of(context)!.settings.arguments as Map<String, dynamic>?;

    if (args == null) {
      SchedulerBinding.instance!.addPostFrameCallback((timeStamp) {
        Navigator.popUntil(context, ModalRoute.withName('/'));
      });
    } else {
      title = args['title'];
      content = args['content'];
    }

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          tooltip: 'Voltar',
          icon: Icon(Icons.arrow_back),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
        title: Text('Pré-Visualização'),
      ),
      body: PdfPreview(
        pdfFileName: title,
        build: (format) => _generatePdf(format, title),
      ),
    );
  }
}
