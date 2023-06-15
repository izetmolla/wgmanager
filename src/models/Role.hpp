class Role : public Model
{
public:
    int id;
    std::string role = "";
    int user_id = 0;

public:
    Role()
    {
        set_table_name("roles");
    }
    void set_attributes(char **argv, char **col_names, int colnr) override
    {
        for (size_t i = 0; i < colnr; i++)
            setValue(col_names[i], argv[i]);
    }

private:
    void setValue(std::string col, std::string value)
    {
        if (col == "id")
            id = std::stoi(value);
        else if (col == "role")
            role = value;
        else if (col == "user_id")
            user_id = std::stoi(value);
        else if (col == "created_at")
            created_at = value;
        else if (col == "updated_at")
            updated_at = value;
    }
};
