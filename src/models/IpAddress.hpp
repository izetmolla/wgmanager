class IpAddress : public Model
{
private:
    /* data */
public:
    int id = 0;
    int client_id = 0;       // INTEGER NOT NULL,
    int type = 1;            // INTEGER NOT NULL,
    int status = 1;          // INTEGER DEFAULT 1,
    std::string ip = "";     // TEXT NOT NULL,
    std::string octet0 = ""; // TEXT NOT NULL,
    std::string octet1 = ""; // TEXT NOT NULL,
    std::string octet2 = ""; // TEXT NOT NULL,
    std::string octet3 = ""; // TEXT NOT NULL,
    std::string cidr = "";   // TEXT NOT NULL,
    std::string ips = "[]";

public:
    IpAddress()
    {
        set_table_name("ip_addresses");
    }
    void set_attributes(char **argv, char **col_names, int colnr) override
    {
        for (size_t i = 0; i < colnr; i++)
            setValue(col_names[i], argv[i]);
    }

    template <typename T>
    T getByIp(std::string ip)
    {
        T model;
        auto content = database.query<T>("select * from ip_addresses where ip='" + ip + "' Limit 1");
        if (content.size() > 0)
            return content[0];
        else
            return model;
    }

    static int insertIp(std::string ip_adr, int type = 1, int client_id = 0)
    {
        std::cout << "Deleteing: " << ip_adr << " - " << type << " - " << client_id << std::endl;
        bool alAl = database.query_delete("DELETE FROM ip_addresses where ip='" + ip_adr + "' AND type='" + std::to_string(type) + "' AND client_id='" + std::to_string(client_id) + "'");
        ParsedIp ipParsed = utils::parseIP(ip_adr);
        return database.insert_record("ip_addresses", {{"ip", ip_adr}, {"client_id", std::to_string(client_id)}, {"type", std::to_string(type)}, {"octet0", ipParsed.octet0}, {"octet1", ipParsed.octet1}, {"octet2", ipParsed.octet2}, {"octet3", ipParsed.octet3}, {"cidr", ipParsed.cidr}, {"created_at", utils::now()}, {"updated_at", utils::now()}});
    }

private:
    void setValue(std::string table, std::string value)
    {
        if (table == "id")
            id = std::stoi(value);
        else if (table == "client_id")
            client_id = std::stoi(value);
        else if (table == "type")
            type = std::stoi(value);
        else if (table == "status")
            status = std::stoi(value);
        else if (table == "ip")
            ip = value;
        else if (table == "octet0")
            octet0 = value;
        else if (table == "octet1")
            octet1 = value;
        else if (table == "octet2")
            octet2 = value;
        else if (table == "octet3")
            octet3 = value;
        else if (table == "cidr")
            cidr = value;
        else if (table == "created_at")
            created_at = value;
        else if (table == "updated_at")
            updated_at = value;
        else if (table == "ips")
            ips = value;
    }
};