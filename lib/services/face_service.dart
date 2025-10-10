import 'package:image/image.dart' as img;
import 'package:tflite_flutter/tflite_flutter.dart';
import 'dart:math';

class FaceService {
  late Interpreter _interpreter;

  Future<void> loadModel() async {
    try {
      _interpreter = await Interpreter.fromAsset('models/facenet.tflite');
      print('✅ FaceNet model loaded successfully');
    } catch (e) {
      print('❌ Failed to load FaceNet model: $e');
    }
  }

  /// Takes a face crop (img.Image) and returns 128-d embedding as List<double>
  List<double> getFaceEmbedding(img.Image faceImage) {
    // Resize to 160x160 (FaceNet input size)
    final resized = img.copyResize(faceImage, width: 160, height: 160);

    // Normalize pixel values [0,255] -> [-1,1]
    var input = List.generate(
      1,
      (_) => List.generate(
        160,
        (y) => List.generate(
          160,
          (x) {
            final pixel = resized.getPixel(x, y);
            final r = (((pixel >> 16) & 0xFF) / 127.5) - 1.0;
            final g = (((pixel >> 8) & 0xFF) / 127.5) - 1.0;
            final b = ((pixel & 0xFF) / 127.5) - 1.0;

            return [r, g, b];
          },
        ),
      ),
    );

    // Prepare output buffer
    var output = List.filled(1 * 128, 0.0).reshape([1, 128]);

    // Run inference
    _interpreter.run(input, output);

    return List<double>.from(output.reshape([128]));
  }

  /// Compute similarity (cosine distance)
  double compareEmbeddings(List<double> e1, List<double> e2) {
    double dot = 0.0;
    double norm1 = 0.0;
    double norm2 = 0.0;
    for (int i = 0; i < e1.length; i++) {
      dot += e1[i] * e2[i];
      norm1 += e1[i] * e1[i];
      norm2 += e2[i] * e2[i];
    }
    return dot / (sqrt(norm1) * sqrt(norm2));
  }
}
