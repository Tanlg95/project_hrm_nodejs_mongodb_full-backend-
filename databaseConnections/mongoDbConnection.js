const objectConfig =
    {
        user: process.env.USER_MONGODB,
        password: process.env.PASSWORD_MONGODB,
        server: process.env.SERVER_MONGODB,
        port: process.env.PORT_MONGODB,
        authmechanism: process.env.AUTHMECHANISM_MONGODB,
        authsource: process.env.AUTHSOURCE_MONGODB
    };
const connectString = (function(){
    const connectHide = new WeakMap(); 
    class connectionDB{
        constructor(){}
        setConnection(connectString){
            connectHide.set(this,connectString);
        }
        getConnection()
        {
            return connectHide.get(this);
        }
        getURL(){
            return `mongodb://${connectHide.get(this).user}:
${connectHide.get(this).password}@${connectHide.get(this).server}:
${connectHide.get(this).port}/?authMechanism=${connectHide.get(this).authmechanism}&authSource=${connectHide.get(this).authsource}`;

        }
    }
    return connectionDB;
})();

const connectionOutPut = new connectString();
connectionOutPut.setConnection(objectConfig);

module.exports = connectionOutPut.getURL();