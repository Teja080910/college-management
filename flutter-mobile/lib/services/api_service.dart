import 'dart:convert';
import 'dart:io';
import 'package:shared_preferences/shared_preferences.dart';

const _baseUrl = 'https://mock-college-management.vercel.app';

Future<String?> _getToken() async {
  final prefs = await SharedPreferences.getInstance();
  return prefs.getString('@portal_token');
}

Future<Map<String, String>> _headers() async {
  final token = await _getToken();
  final headers = {'Content-Type': 'application/json'};
  if (token != null) headers['Authorization'] = 'Bearer $token';
  return headers;
}

Future<dynamic> _request(String method, String name, {Map<String, dynamic>? body, int? id}) async {
  final url = id != null ? '$_baseUrl/api/data/$name?id=$id' : '$_baseUrl/api/data/$name';
  final client = HttpClient();
  final request = await client.openUrl(method, Uri.parse(url));
  (await _headers()).forEach((k, v) => request.headers.set(k, v));
  if (body != null) {
    request.write(jsonEncode(body));
  }
  final response = await request.close();
  final responseBody = await response.transform(utf8.decoder).join();
  client.close();
  if (response.statusCode >= 200 && response.statusCode < 300) {
    return jsonDecode(responseBody);
  }
  throw Exception('API error: ${response.statusCode}');
}

Future<dynamic> fetchData(String name) => _request('GET', name);

Future<dynamic> createRecord(String name, Map<String, dynamic> data) => _request('POST', name, body: data);

Future<dynamic> updateRecord(String name, Map<String, dynamic> data) => _request('PUT', name, body: data);

Future<dynamic> deleteRecord(String name, int id) => _request('DELETE', name, id: id);
