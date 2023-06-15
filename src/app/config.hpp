struct ConfigEnv
{
    bool versionCheck = false;
    int port = 2252;
    std::string host = "0.0.0.0";
    std::string db_path = "./database.db";

    std::string WG_PATH = "/etc/wireguard/wg0.conf";
    std::string WG_PRIVATE_KEY = "";
    std::string WG_PUBLIC_KEY = "";
    std::string WG_IPV4_NETWORK = "10.10.10.0/24";
    std::string WG_ENDPOINT = "";
    std::string WG_PORT = "51820";
    std::string WG_PERSISTENT_KEEPALIVE = "0";
    std::string WG_DNS_IP = "1.1.1.1";
    std::string WG_MTU = "";
    std::string WG_POST_UP = "";
    std::string WG_POST_DOWN = "";

    std::string access_token_secret = "jefiebrfwknecrhjesfnirtwbekj";
    std::string refresh_token_secret = "flkdjsfjbcrenkjwnvrenlrgkvjtrkgnv";
    int access_token_time = 15;
    int refresh_token_time = 36000;

    void setEnv(std::string name, std::string option)
    {

        if (name == "WG_PRIVATE_KEY")
            WG_PRIVATE_KEY = option;
        if (name == "WG_PUBLIC_KEY")
            WG_PUBLIC_KEY = option;
        if (name == "WG_IPV4_NETWORK")
            WG_IPV4_NETWORK = option;
        if (name == "WG_ENDPOINT")
            WG_ENDPOINT = option;
        if (name == "WG_PORT")
            WG_PORT = option;
        if (name == "WG_PERSISTENT_KEEPALIVE")
            WG_PERSISTENT_KEEPALIVE = option;
        if (name == "WG_DNS_IP")
            WG_DNS_IP = option;
        if (name == "WG_MTU")
            WG_MTU = option;
        if (name == "WG_POST_UP")
            WG_POST_UP = option;
        if (name == "WG_POST_DOWN")
            WG_POST_DOWN = option;
    }
};
ConfigEnv configEnv;

std::string cliOptions(CLI::App &app)
{
    if (app.got_subcommand("restart"))
    {
        std::cout << "Restarting" << std::endl;
        return "OK";
    }
    else
    {
        std::cout << "Starting server on Port: " << configEnv.port << std::endl;
        return "start";
    }
}

struct ColumnDbObject
{
    std::string name = "";
    std::string type = "";
    std::string defaultValue = "";
};

struct DbConditionObject
{
    std::string attribute = "";
    std::string condition = "";
    std::string atrValue = "";
    std::string operatorType = "";
};

struct MigrateOptions
{
    bool drop = false;
    bool debug = false;
};

struct ValidationResponse
{
    bool status = false;
    std::string message = "";
    std::string path = "";
};

struct ValidationSchema
{
    std::string key;
    std::vector<std::pair<std::string, std::string>> rules;
};

struct Tokens
{
    std::string access_token = "";
    std::string refresh_token = "";
};

struct VerifyToken
{
    int status = 200;
    int id = 0;
    std::string message = "";
    std::string roles = "";
    // std::vector<std::string> roles = {};
};

struct Pagination
{
    int page = 1;
    int limit = 30;
    int offset = 0;
    int total = 0;
    int pages = 0;
};

struct ParsedIp
{
    std::string ip = "";
    std::string cidr = "";
    std::string octet0 = "";
    std::string octet1 = "";
    std::string octet2 = "";
    std::string octet3 = "";
};

struct KeyGenerator
{
    std::string public_key = "";
    std::string private_key = "";
    std::string preshared_key = "";
};

struct WgStatistics
{
    std::string public_key = "";
    std::string preshared_key = "";
    std::string endpoint = "";
    std::string allowedIps = "";
    int lastHandshakeTime = 0;
    int transferRx = 0;
    int transferTx = 0;
    int persistentKeepalive = 0;
    int client_id = 0;
};