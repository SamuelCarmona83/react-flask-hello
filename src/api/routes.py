"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
import firebase_admin
from firebase_admin import credentials, storage

cred = credentials.Certificate("./google-services.json")
firebase_admin.initialize_app(cred, {
    'storageBucket': "narutos-beers.appspot.com"
})

bucket = storage.bucket()

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/image', methods=["POST"])
def upload_file():
    
    image = request.files.get("image", None)

    if image == None:
        return 'No hay image en la peticion', 400

    # Subir la imagen al Bucket
    blob = bucket.blob(image.filename)
    blob.upload_from_file(image, content_type=image.content_type)
    blob.make_public()
    
    # Generar la URL permanente
    url = blob.public_url
    from urllib.parse import quote
    # Generar la URL permanente manualmente
    bucket_name = "narutos-beers.appspot.com"
    encoded_image_name = quote(image.filename)
    url = f'https://storage.googleapis.com/{bucket_name}/{encoded_image_name}'

    # Retornar la URL permanente
    return jsonify({"success": "La imagen ha sido cargada correctamente", "url": url}), 200


@api.route("/login", methods=["POST"])
def login():

    email = request.json.get("email", None)
    password = request.json.get("password", None)
    
    if email == None or password == None:
        return jsonify({"msg": "Bad email or password"}), 401

    user = User.query.filter_by(email=email).one_or_none()

    if user != None:

        if password == user.password:
            access_token = create_access_token(identity=email)
            return jsonify(access_token=access_token)
        else:
            return jsonify({"msg": "Wrong password"}), 401
        
    return jsonify({"msg": "User not found"}), 404

@api.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user, is_active=True).one_or_none()
    if user != None:
        return jsonify(user.serialize()), 200
    return jsonify({ "msg" : "This user is inactive, please contact support!"}), 200