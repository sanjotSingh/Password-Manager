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
  String  xml = getHTTP(new URL(url.getValue().toString()));
  out.setValue(xml);
  
}


public static String getHTTP(final URL destination) throws IOException, MalformedURLException {
  // Handle MalformedURLException
  try 
  {
    final HttpURLConnection connection = (HttpURLConnection) destination.openConnection();
    connection.setRequestMethod("GET");
    connection.setRequestProperty("Host", destination.getHost());
    connection.setDoOutput(true);
    connection.connect();

    try 
    {
      int responseCode = connection.getResponseCode();
      if (responseCode != HttpURLConnection.HTTP_OK) 
      {
        return "Request Failed: "+ connection.getResponseCode();
      }

      StringBuilder inString = new StringBuilder();
      try (BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()))) 
      {
        String inBuffer;
        while ((inBuffer = in.readLine()) != null) 
        {
          inString.append(inBuffer).append("\n");
        }
      }

      return inString.toString();
    } finally 
    {
      connection.disconnect();
    }
  } catch (MalformedURLException e) {
    return "Invalid URL";
  }
}

