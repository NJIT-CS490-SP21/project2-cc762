import os
from flask import Flask, send_from_directory, json, session
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

app = Flask(__name__, static_folder='./build/static')

# Point SQLAlchemy to your Heroku database
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
# Gets rid of a warning
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

db.create_all()
db.session.commit()

cors = CORS(app, resources={r"/*": {"origins": "*"}})

socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    json=json,
    manage_session=False
)

#Segment for handling the users
users = []
x = None
o = None
#server side turn var
turn = 0;
board = ["-", "-", "-", "-", "-", "-", "-", "-", "-"]

def checkWin():
    global board
    global turn
    
    lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
    ];
    for i in lines:
        a = i[0];
        b = i[1];
        c = i[2];
        if board[a] ==  board[b] and board[b] == board[c] and board[c] in "XO":
            return board[a];
    return False;


def addUser(user):
    global x, o
    from models import Player
    if(len(users) == 0):
        tile = "X"
        x = user
    elif(len(users) == 1):
        tile = "O"
        o = user
    else:
        tile = "Spectator"
    newUser = {"name": user, "xo": tile}
    users.append(newUser)
    if(Player.query.filter_by(username=user).first() == None):
        db.session.add(Player(username=user, points=100, wins=0, losses=0))
        db.session.commit()
    leader = getLeaderBoard()
    socketio.emit('leaderboard', leader, broadcast=True, include_self=True)
    return newUser

def getLeaderBoard():
    from models import Player
    query = Player.query.order_by(Player.points.desc())
    leader = []
    for p in query:
        print(p)
        leader.append( {"username":p.username, "points":p.points, "wins":p.wins, "losses":p.losses} )
    return leader

def applyWinner(win):
    from models import Player
    global x, o
    if win == "X":
        winner = x
        loser = o
    else:
        winner = o
        loser = x
    print(x)
    print(o)
    p1 = Player.query.filter_by(username=winner).first()
    p2 = Player.query.filter_by(username=loser).first()
    p1.wins += 1
    p2.losses += 1
    p1.points = p1.points + 1
    p2.points = p2.points - 1
    db.session.merge(p1)
    db.session.merge(p2)
    db.session.commit()
    print("Points", Player.query.filter_by(username=winner).first().points)
    leader = getLeaderBoard()
    socketio.emit('leaderboard', leader, broadcast=True, include_self=True)

@app.route('/', defaults={"filename": "index.html"})
@app.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)

@socketio.on("requestUserList")
def on_requestUserList(data):
    print("User List Requested")
    socketio.emit('requestUserList', users, to=data["id"], broadcast=False, include_self=True)#note the false broadcast, because we dont want everyone to update anytime someone asks for the list

@socketio.on("leaderboard")
def on_requestLeader(data):
    from models import Player
    print("Leaderboard Requested")
    leader = getLeaderBoard()
    socketio.emit('leaderboard', leader, to=data["id"], broadcast=False, include_self=True)

# When a client connects from this Socket connection, this function is run
@socketio.on('login')
def on_login(data):
    print('User login!')
    if "usr" in data.keys():#proper error handilng for empty/misformed packets not implemented
        user = addUser(data["usr"])
    print(data["id"])
    socketio.emit('addUserCallback', user, to=data["id"], broadcast=False, include_self=True)
    socketio.emit('updateUsers', data, broadcast=True, include_self=False)#Tells all instances a new user has been added
    
# When a client disconnects from this Socket connection, this function is run
@socketio.on('disconnect')
def on_disconnect():
    print('User disconnected!')
    
@socketio.on('connect')
def on_connect():
    print('User connected!')

# When a client emits the event 'board' to the server, this function is run
@socketio.on('board')
def on_chat(data):
    from models import Player
    global turn, board
    turn += 1
    board[data["num"]] = data["usr"]["xo"]
    print(board)
    win = checkWin()
    print(win)
    if win != False:
        applyWinner(win)
        socketio.emit('win', win, broadcast=True, include_self=True)
        print("winner signal emitted")
    if turn >= 9:
        socketio.emit('win', "Draw", broadcast=True, include_self=True)
    data["turn"] = turn;
    print("Emmitting Board Change")
    print(data)
    socketio.emit('board', data, broadcast=True, include_self=True)

#Reset board
@socketio.on('reset')
def on_reset():
    print("Resetting Game")
    global board, users, turn, x, o
    board = ["-", "-", "-", "-", "-", "-", "-", "-", "-"] 
    users = []
    turn = 0
    x = None
    o = None
    socketio.emit('reset', broadcast=True, include_self=True)

# Note we need to add this line so we can import app in the python shell
if __name__ == "__main__":
# Note that we don't call app.run anymore. We call socketio.run with app arg
    socketio.run(
        app,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
    )