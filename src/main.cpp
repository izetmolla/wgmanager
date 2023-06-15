#define CROW_STATIC_DIRECTORY "./public_html/"
#define CROW_STATIC_ENDPOINT "/<path>"
#define CROW_JSON_USE_MAP
#include "app/packages.hpp"

int main(int argc, char *argv[], char *envp[])
{
    CLI::App cliApp{"manager cli"};
    utils::loadEnvFromFile();
    cliCommands(cliApp);
    CLI11_PARSE(cliApp, argc, argv);

    if (database.connect())
    {
        Migrations::migrate();
        Option::setEnvOptions();
        if (cliOptions(cliApp) == "start")
        {
            define_routes();
        }
        return 0;
    }
    else
    {
        std::cout << "Failed to connect to database" << std::endl;
        return 1;
    }
}