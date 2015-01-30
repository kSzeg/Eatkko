# Homepage (Root path)
get '/' do
  yelp_client = Yelp::Client.new({ consumer_key: settings.yelp_consumer_key, consumer_secret: settings.yelp_consumer_secret, token: settings.yelp_token, token_secret: settings.yelp_token_secret })
  coordinates = { latitude: 49.18281, longitude: -122.84469}
  results = yelp_client.search_by_coordinates(coordinates)
  @info = results.to_json
  erb :index
end