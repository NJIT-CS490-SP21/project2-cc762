"""
DOCSTRING
Server for tic tac toe
"""

import os
from flask import Flask, send_from_directory, json
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

APP = Flask(__name__, static_folder='./build/static')

# Point SQLAlchemy to your Heroku database
APP.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
# Gets rid of a warning
APP.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

DB = SQLAlchemy(APP)

DB.create_all()
DB.session.commit()

CORS = CORS(APP, resources={r"/*": {"origins": "*"}})

SOCKETIO = SocketIO(APP,
                    cors_allowed_origins="*",
                    json=json,
                    manage_session=False)

#Segment for handling the users
USERS = []
X = None
O = None
#server side turn var
TURN = 0
BOARD = ["-", "-", "-", "-", "-", "-", "-", "-", "-"]


def check_win(board):
    """
    DOCSTRING
    Expects a 9 length array which it treats as a 3 by 3 board and tells if someone won
    """
    lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ]
    for i in lines:
        c_1 = i[0]
        c_2 = i[1]
        c_3 = i[2]
        if board[c_1] == board[c_2] and board[c_2] == board[c_3] and board[c_3] in "XO":
            return board[c_1]
    return False


def add_user(user):
    """
    DOCSTRING
    Adds a user to the database and the list of people in game/spectating
    """
    global X, O, USERS
    from models import Player
    if len(USERS) == 0:
        tile = "X"
        X = user
    elif len(USERS) == 1:
        tile = "O"
        O = user
    else:
        tile = "Spectator"
    new_user = {"name": user, "xo": tile}
    USERS.append(new_user)
    if Player.query.filter_by(username=user).first() is None:
        DB.session.add(Player(username=user, points=100, wins=0, losses=0))
        DB.session.commit()
    leader = get_leader_board()
    SOCKETIO.emit('leaderboard', leader, broadcast=True, include_self=True)
    return new_user



def query_for_leaderboard():
    """
    This function is dumb but i need to show mocking
    """
    from models import Player
    return Player.query.order_by(Player.points.desc())

def get_leader_board():
    """
    DOCSTRING
    emits the leaderboard
    """
    query = query_for_leaderboard()
    leader = []
    for i in query:
        print(i)
        leader.append({
            "username": i.username,
            "points": i.points,
            "wins": i.wins,
            "losses": i.losses
        })
    return leader


def apply_winner(win):
    """
    DOCSTRING
    Updates the leaderboard and informs the client who has won
    """
    from models import Player
    global X, O
    if win == "X":
        winner = X
        loser = O
    else:
        winner = O
        loser = X
    print(X)
    print(O)
    p_1 = Player.query.filter_by(username=winner).first()
    p_2 = Player.query.filter_by(username=loser).first()
    p_1.wins += 1
    p_2.losses += 1
    p_1.points = p_1.points + 1
    p_2.points = p_2.points - 1
    DB.session.merge(p_1)
    DB.session.merge(p_2)
    DB.session.commit()
    print("Points", Player.query.filter_by(username=winner).first().points)
    leader = get_leader_board()
    SOCKETIO.emit('leaderboard', leader, broadcast=True, include_self=True)


@APP.route('/', defaults={"filename": "index.html"})
@APP.route('/<path:filename>')
def index(filename):
    """
    DOCSTRING
    Artifact
    """
    return send_from_directory('./build', filename)


@SOCKETIO.on("requestUserList")
def on_request_user_list(data):
    """
    DOCSTRING
    """
    print("User List Requested")
    SOCKETIO.emit(
        'requestUserList',
        USERS,
        to=data["id"],
        broadcast=False,
        include_self=True
    )

@SOCKETIO.on("leaderboard")
def on_request_leader(data):
    """
    DOCSTRING
    """
    print("Leaderboard Requested")
    leader = get_leader_board()
    SOCKETIO.emit('leaderboard',
                  leader,
                  to=data["id"],
                  broadcast=False,
                  include_self=True)


# When a client connects from this Socket connection, this function is run
@SOCKETIO.on('login')
def on_login(data):
    """
    DOCSTRING
    """
    print('User login!')
    if "usr" in data.keys(
    ):  #proper error handilng for empty/misformed packets not implemented
        user = add_user(data["usr"])
    print(data["id"])
    SOCKETIO.emit('addUserCallback',
                  user,
                  to=data["id"],
                  broadcast=False,
                  include_self=True)
    SOCKETIO.emit(
        'updateUsers', data, broadcast=True,
        include_self=False)  #Tells all instances a new user has been added


# When a client disconnects from this Socket connection, this function is run
@SOCKETIO.on('disconnect')
def on_disconnect():
    """
    DOCSTRING
    """
    print('User disconnected!')


@SOCKETIO.on('connect')
def on_connect():
    """
    DOCSTRING
    """
    print('User connected!')


# When a client emits the event 'board' to the server, this function is run
@SOCKETIO.on('board')
def on_board_update(data):
    """
    DOCSTRING
    """
    global TURN, BOARD
    TURN += 1
    BOARD[data["num"]] = data["usr"]["xo"]
    print(BOARD)
    win = check_win(BOARD)
    print(win)
    if win:
        apply_winner(win)
        SOCKETIO.emit('win', win, broadcast=True, include_self=True)
        print("winner signal emitted")
    if TURN >= 9:
        SOCKETIO.emit('win', "Draw", broadcast=True, include_self=True)
    data["turn"] = TURN
    print("Emmitting Board Change")
    print(data)
    SOCKETIO.emit('board', data, broadcast=True, include_self=True)
    return BOARD


#Reset board
@SOCKETIO.on('reset')
def on_reset():
    """
    DOCSTRING
    """
    print("Resetting Game")
    global BOARD, USERS, TURN, X, O
    BOARD = ["-", "-", "-", "-", "-", "-", "-", "-", "-"]
    USERS = []
    TURN = 0
    X = None
    O = None
    SOCKETIO.emit('reset', broadcast=True, include_self=True)


# Note we need to add this line so we can import app in the python shell
if __name__ == "__main__":
    # Note that we don't call app.run anymore. We call SOCKETIO.run with app arg
    SOCKETIO.run(
        APP,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
    )
