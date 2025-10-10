import 'package:flutter/material.dart';

class AppTheme {
  // Colors: primary blue, accent red, and neutrals
  static const Color primaryBlue = Color(0xFF1E66F5);
  static const Color accentRed = Color(0xFFE11D48);
  static const Color bg = Color(0xFFF7F7F9);
  static const Color surface = Colors.white;
  static const Color text = Color(0xFF111827);

  static ThemeData theme = ThemeData(
    colorScheme: ColorScheme.fromSeed(
      seedColor: primaryBlue,
      primary: primaryBlue,
      secondary: accentRed,
      surface: surface,
      background: bg,
      onPrimary: Colors.white,
      onSecondary: Colors.white,
      onSurface: text,
      onBackground: text,
      brightness: Brightness.light,
    ),
    scaffoldBackgroundColor: bg,
    appBarTheme: const AppBarTheme(
      elevation: 0,
      backgroundColor: surface,
      foregroundColor: text,
      centerTitle: true,
    ),
    useMaterial3: true,
  );
}
