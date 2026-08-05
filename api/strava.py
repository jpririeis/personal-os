import os
import requests
from flask import jsonify # (or your framework's equivalent response handler)

def get_strava_activities():
    auth_url = "https://www.strava.com/oauth/token"
    payload = {
        'client_id': os.environ.get('STRAVA_CLIENT_ID'),
        'client_secret': os.environ.get('STRAVA_CLIENT_SECRET'),
        'refresh_token': os.environ.get('STRAVA_REFRESH_TOKEN'),
        'grant_type': 'refresh_token'
    }
    
    auth_res = requests.post(auth_url, data=payload)
    if auth_res.status_code != 200:
        return {"error": "Failed to authenticate with Strava"}, 400
        
    access_token = auth_res.json().get('access_token')
    
    activities_url = "https://www.strava.com/api/v3/athlete/activities"
    headers = {'Authorization': f'Bearer {access_token}'}
    response = requests.get(activities_url, headers=headers, params={'per_page': 10})
    
    if response.status_code == 200:
        activities = response.json()
        parsed_data = []
        for act in activities:
            parsed_data.append({
                "name": act.get("name"),
                "type": act.get("sport_type") or act.get("type"),
                "distance_miles": round(act.get("distance", 0) / 1609.34, 2),
                "duration_min": round(act.get("moving_time", 0) / 60, 1),
                "avg_hr": act.get("average_heartrate"),
                "date": act.get("start_date_local")
            })
        return parsed_data
    return []
