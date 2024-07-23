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
    
  //inputs
  String  xml = deleteRequest(new URL(url.getValue().toString()));
  out.setValue(xml);
  
}


public static String deleteRequest(final URL destination) throws IOException {
    HttpURLConnection connection = null;
    try {
        // Open connection
        connection = (HttpURLConnection) destination.openConnection();
        connection.setRequestMethod("DELETE");

        // Get response code
        int responseCode = connection.getResponseCode();

        // Handle successful response
        if (responseCode == HttpURLConnection.HTTP_OK || responseCode == HttpURLConnection.HTTP_NO_CONTENT) {
            StringBuilder response = new StringBuilder();
            try (BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()))) {
                String line;
                while ((line = in.readLine()) != null) {
                    response.append(line);
                }
            }
            return response.toString();
        } else {
            System.out.println("DELETE request failed with response code: " + responseCode);
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
