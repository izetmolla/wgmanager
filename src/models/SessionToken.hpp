class SessionToken : public Model
{
public:
    int id = 0;                 // INTEGER PRIMARY KEY,
    std::string token = "";     // INTEGER NOT NULL,
    int user_id = 0;            // INTEGER NOT NULL,
    std::string object_id = ""; // INTEGER DEFAULT 1,

public:
    SessionToken()
    {
        set_table_name("session_tokens");
    }
    void set_attributes(char **argv, char **col_names, int colnr) override
    {
        for (size_t i = 0; i < colnr; i++)
            setValue(col_names[i], argv[i]);
    }
    template <typename T>
    static T findByToken(std::string token)
    {
        T model;
        auto content = database.query<T>("select * from session_tokens where token='" + token + "' Limit 1");
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
        else if (col == "token")
            token = value;
        else if (col == "object_id")
            object_id = value;
        else if (col == "user_id")
            user_id = std::stoi(value);
        else if (col == "created_at")
            created_at = value;
        else if (col == "updated_at")
            updated_at = value;
    }
};
