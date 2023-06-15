class User : public Model
{
public:
    int id = 0;
    int connections = 0;
    int clients = 0;
    std::string email = "";
    std::string fullname = "";
    std::string username = "";
    int status = 1;
    std::string password = "";
    std::string roles = "[]";

public:
    User()
    {
        set_table_name("users");
    }
    void set_attributes(char **argv, char **col_names, int colnr) override
    {
        for (size_t i = 0; i < colnr; i++)
            setValue(col_names[i], argv[i]);
    }

    template <typename T>
    static T getUserByUsername(std::string username)
    {
        T model;
        auto content = database.query<T>("select * from users where username='" + username + "'");
        if (content.size() > 0)
            return content[0];
        else
            return model;
    }

private:
    void setValue(std::string col, std::string value)
    {
        if (col == "id")
            id = std::stoi(value);
        else if (col == "connections")
            connections = std::stoi(value);
        else if (col == "email")
            email = value;
        else if (col == "fullname")
            fullname = value;
        else if (col == "username")
            username = value;
        else if (col == "clients")
            clients = std::stoi(value);
        else if (col == "status")
            status = std::stoi(value);
        else if (col == "password")
            password = value;
        else if (col == "roles")
            roles = value;
    }
};