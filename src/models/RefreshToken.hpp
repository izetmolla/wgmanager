class RefreshToken : public Model
{
private:
    /* data */
public:
    int id = 0;                  //  INTEGER PRIMARY KEY AUTOINCREMENT,
    std::string token = "";      //  TEXT DEFAULT NULL,
    int user_id = 0;             // VARCHAR DEFAULT NULL,
    bool expired = false;        // VARCHAR DEFAULT NULL,
    std::string created_at = ""; //  VARCHAR DEFAULT NULL

public:
    RefreshToken()
    {
        set_table_name("refresh_tokens");
    }
    void set_attributes(char **argv, char **col_names, int colnr) override
    {
        id = std::stoi(argv[0]);
        token = argv[1];
        user_id = std::stoi(argv[2]);
    }

    template <typename T>
    T getItemByToken(std::string token)
    {
        T model;
        auto content = database.query<T>("select * from refresh_tokens where token='" + token + "' Limit 1");
        if (content.size() > 0)
            return content[0];
        else
            return model;
    }
};
