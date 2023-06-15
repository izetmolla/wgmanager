class Client : public Model
{
private:
    /* data */
public:
    int id = 0;
    int user_id = 0;
    std::string name = "";
    std::string public_key = "";
    std::string private_key = "";
    std::string preshared_key = "";
    std::string ipAllocation = "[]";
    std::string dnsServerIps = "[]";
    std::string allowedIps = "[]";
    int lastHandshakeTime = 0;
    int transferRx = 0;
    int transferTx = 0;
    int tRx = 0;
    int tTx = 0;

public:
    Client()
    {
        set_table_name("clients");
    }
    void set_attributes(char **argv, char **col_names, int colnr) override
    {
        for (size_t i = 0; i < colnr; i++)
            setValue(col_names[i], argv[i]);
    }

private:
    void setValue(std::string table, std::string value)
    {
        if (table == "id")
            id = std::stoi(value);
        else if (table == "user_id")
            name = std::stoi(value);
        else if (table == "name")
            name = value;
        else if (table == "public_key")
            public_key = value;
        else if (table == "private_key")
            private_key = value;
        else if (table == "preshared_key")
            preshared_key = value;
        else if (table == "ipAllocation")
            ipAllocation = value;
        else if (table == "dnsServerIps")
            dnsServerIps = value;
        else if (table == "allowedIps")
            allowedIps = value;
        else if (table == "created_at")
            created_at = value;
        else if (table == "updated_at")
            updated_at = value;
        else if (table == "lastHandshakeTime")
            lastHandshakeTime = std::stoi(value);
        else if (table == "transferRx")
            transferRx = std::stoi(value);
        else if (table == "transferTx")
            transferTx = std::stoi(value);
        else if (table == "tTx")
            tTx = std::stoi(value);
        else if (table == "tRx")
            tRx = std::stoi(value);
    }
};