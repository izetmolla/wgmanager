// #pragma once

class JWT
{

public:
    static Tokens getTokens(int user_id, std::string at_content = "", std::string rt_content = "", json roles = "")
    {
        JWT jwt;
        std::string access_token = jwt.createToken("access", configEnv.access_token_time, user_id, at_content, roles);
        std::string refresh_token = jwt.createToken("refresh", configEnv.refresh_token_time, user_id, rt_content, roles);
        return Tokens({access_token, refresh_token});
    }

private:
    std::string createToken(std::string type = "access", int exp = configEnv.access_token_time, int user_id = 0, std::string content = "", json roles = nullptr)
    {
        using namespace jwt::params;
        jwt::jwt_object obj{algorithm("HS256"), payload({{"some", "payload"}}), secret(type == "access" ? configEnv.access_token_secret : configEnv.refresh_token_secret)};
        // Get the encoded string/assertion
        obj.add_claim("iss", "izetmolla.com")
            .add_claim("sub", std::to_string(user_id))
            .add_claim("id", std::to_string(user_id))
            .add_claim("content", content)
            .add_claim("roles", roles.dump())
            // .add_claim("iat", 1513862371)
            .add_claim("exp", std::chrono::system_clock::now() + std::chrono::seconds{exp});
        return obj.signature();
    }

public:
    std::string createAccessToken(int user_id, std::string at_content = "", json roles = nullptr)
    {
        return createToken("access", configEnv.access_token_time, user_id, at_content, roles);
    }

    VerifyToken verifyToken(std::string token, std::string verifyType = "access")
    {
        using namespace jwt::params;
        VerifyToken vt;
        try
        {
            auto dec_obj = jwt::decode(token, algorithms({"HS256"}), secret(verifyType == "access" ? configEnv.access_token_secret : configEnv.refresh_token_secret), verify(true));
            int id = dec_obj.payload().has_claim("id") ? std::stoi(dec_obj.payload().get_claim_value<std::string>("id")) : 0;
            std::string roles = dec_obj.payload().has_claim("roles") ? dec_obj.payload().get_claim_value<std::string>("roles") : "[]";

            vt = {200, id, "", roles};
        }
        catch (const jwt::TokenExpiredError &e)
        {
            vt = {401, 0, "Handle Token expired exception here"};
        }
        catch (const jwt::SignatureFormatError &e)
        {
            vt = {401, 0, "Handle invalid signature format error"};
        }
        catch (const jwt::DecodeError &e)
        {
            vt = {401, 0, "Handle all kinds of other decode errors"};
        }
        catch (const jwt::VerificationError &e)
        {
            vt = {401, 0, "Handle the base verification error."};
        }
        catch (...)
        {
            std::cerr << "Caught unknown exception\n";
            vt = {401, 0, "Caught unknown exception"};
        }
        return vt;
    }
};