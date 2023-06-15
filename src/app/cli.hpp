void cliCommands(CLI::App &cliApp)
{

    auto addGenericOptions = [](CLI::App *app) {};
    cliApp.add_flag("--version", configEnv.versionCheck, "Print manager version");
    CLI::App *start_app = cliApp.add_subcommand("restart", "Start or restart manager server!");
    start_app->fallthrough();

    // CLI::App *create_app = cliApp.add_subcommand("create", "Create client or agent");
    // create_app->fallthrough();
    // create_app->add_option("option", cliapp.option, "CLient, Agent, Container...")->required();
    // create_app->add_option("name", cliapp.name, "Name");

    // CLI::App *delete_app = cliApp.add_subcommand("delete", "Delete client or agent");
    // delete_app->fallthrough();
    // delete_app->add_option("option", cliapp.option, "Option")->required();
    // delete_app->add_option("id", cliapp.id, "Client Or Agent id")->required();

    // CLI::App *get_app = cliApp.add_subcommand("get", "get Clients, Node ...");
    // get_app->fallthrough();
    // get_app->add_option("option", cliapp.option, "Client Or Agent id")->required();
    // get_app->add_option("id", cliapp.id, "Client Or Agent id");

    // CLI::App *describe_app = cliApp.add_subcommand("describe", "Describe Clients, Node ...");
    // describe_app->fallthrough();
    // describe_app->add_option("option", cliapp.option, "Client Or Agent id")->required();
    // describe_app->add_option("id", cliapp.option, "Client Or Agent id")->required();

    // CLI::App *exec_app = cliApp.add_subcommand("exec", "Describe Clients, Node ...");
    // exec_app->fallthrough();
    // // exec_app->add_option("option", cliapp.option, "Client, Agent, Container")->required();
    // exec_app->add_option("id", cliapp.id, "Client Or Agent id")->required();
    // exec_app->add_option("cmd", cliapp.cmd, "Command Line, default is (bash)");
}