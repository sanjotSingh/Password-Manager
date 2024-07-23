/*IMPORTS
*import java.io.BufferedReader;
*import java.io.IOException;
*import java.io.InputStreamReader;
*import java.net.HttpURLConnection;
*import java.net.URL;
*import java.io.OutputStream;
*import java.net.MalformedURLException;
*/
public void onRefresh() throws Exception
{
  BStatusString out       = getOut();
  BStatusString url       = getUrl();
  BStatusString json      = getDataIn(); 

  String  xml = postRequest(new URL(url.getValue().toString()), json.getValue().toString());
  out.setValue(xml);
}


public static String postRequest(final URL destination, String jsonData) throws IOException {
    HttpURLConnection connection = null;
    try {
        // Open connection
        connection = (HttpURLConnection) destination.openConnection();
        connection.setRequestMethod("POST");
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setDoOutput(true);

        // Write JSON data to output stream
        try (OutputStream os = connection.getOutputStream()) {
            byte[] input = jsonData.getBytes("utf-8");
            os.write(input, 0, input.length);
        }

        // Get response code
        int responseCode = connection.getResponseCode();

        // Handle successful response
        if (responseCode == HttpURLConnection.HTTP_OK || responseCode == HttpURLConnection.HTTP_CREATED) {
            StringBuilder response = new StringBuilder();
            try (BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()))) {
                String line;
                while ((line = in.readLine()) != null) {
                    response.append(line);
                }
            }
            return response.toString();
        } else {
            System.out.println("POST request failed with response code: " + responseCode);
            return null;
        }
    } catch (MalformedURLException e) {
        System.out.println("Invalid URL: " + e.getMessage());
        return null;
    } finally {
        if (connection != null) {
            connection.disconnect();
        }
    }
}