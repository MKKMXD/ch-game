export default class Log 
{
    static scene = null;
    static messages = [];
    static text = null;
    static add = (message) => {
        let today = new Date();
        message = today.toISOString().slice(11, 23) + ": " + message;

        if (Log.messages.length > 10) {
            Log.messages.pop();
        }

        Log.messages.unshift(message);

        if (Log.scene) {
            let message = "";
            for (let index = 0; index < Log.messages.length; index++) {
                const element = Log.messages[index];
                message += element + '\n';
            }

            if (Log.text) {
                Log.text.setText("");
            }

            Log.text = Log.scene.add.text(0, 0, message, { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', color: '#FF5500', fontSize: '14px'});
        }
    }
}