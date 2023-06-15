class Option : public Model
{
public:
    int id;
    std::string name = "";
    std::string option = "";

public:
    Option()
    {
        set_table_name("options");
    }
    void set_attributes(char **argv, char **col_names, int colnr) override
    {
        for (size_t i = 0; i < colnr; i++)
            setValue(col_names[i], argv[i]);
    }

    template <typename T>
    T getByName(std::string name)
    {
        T model;
        auto content = database.query<T>("select * from options where name='" + name + "' Limit 1");
        if (content.size() > 0)
            return content[0];
        else
            return model;
    }
    static std::string get(std::string name)
    {
        auto option = database.query<Option>("select * from options where name like '" + name + "'");
        if (option.size() > 0)
            return option[0].option;
        else
            return "";
    }

    static void setEnvOptions()
    {
        auto options = database.query<Option>("select * from options");
        for (auto option : options)
            configEnv.setEnv(option.name, option.option);
    }

private:
    void setValue(std::string table, std::string value)
    {
        if (table == "id")
            id = std::stoi(value);
        else if (table == "name")
            name = value;
        else if (table == "option")
            option = value;
        else if (table == "created_at")
            created_at = value;
        else if (table == "updated_at")
            updated_at = value;
    }
};