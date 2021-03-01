import os
from flask import Flask, send_from_directory, json, session
from flask_socketio import SocketIO
from flask_cors import CORS

app = Flask(__name__, static_folder='./build/static')

cors = CORS(app, resources={r"/*": {"origins": "*"}})

socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    json=json,
    manage_session=False
)

#Segment for handling the users
users = []
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
        if board[a] in "XO" and board[b] in "XO" and board[c] in "XO":
            return board[a];
    return False;


def addUser(user):
    if(len(users) == 0):
        tile = "X"
    elif(len(users) == 1):
        tile = "O"
    else:
        tile = "Spectator"
    newUser = {"name": user, "xo": tile}
    users.append(newUser)
    return newUser

@app.route('/', defaults={"filename": "index.html"})
@app.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)

@socketio.on("requestUserList")
def on_requestUserList():
    socketio.emit("requestUserList", users, broadcast=False, include_self=False)#note the false broadcast, because we dont want everyone to update anytime someone asks for the list

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
    global turn
    turn += 1
    global board
    board[data["num"]] = data["usr"]["xo"]
    print(board)
    win = checkWin()
    if win != False:
        socketio.emit('win', win, broadcast=True, include_self=True)
    if turn > 9:
        socketio.emit('draw', broadcast=True, include_self=True)
    else:
        data["turn"] = turn;
        socketio.emit('board', data, broadcast=True, include_self=True)

#Reset board
@socketio.on('reset')
def on_reset():
    print("Resetting Game")
    global users 
    users = []
    global turn
    turn = 0
    socketio.emit('reset', broadcast=True, include_self=True)

# Note that we don't call app.run anymore. We call socketio.run with app arg
socketio.run(
    app,
    host=os.getenv('IP', '0.0.0.0'),
    port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
)