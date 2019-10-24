namespace boltalka.Migrations
{
    using boltalka.Models;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<boltalka.Models.UserDBContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
        }

        protected override void Seed(boltalka.Models.UserDBContext context)
        {
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data. E.g.
            //
                context.Users.AddOrUpdate(
                  p => p.userid,
                  new User { userid = 0, UserGid = 0, NickName = "Doorman", NickColor = "#ffffff", MsgColor = "#ffffff", SelectedAsRecipient = false, ItsMe = false, banned = false, password = "1" },
                  new User { userid = 100, UserGid = 10, NickName = "Администратор", NickColor = "#ffffff", MsgColor = "#ffffff", SelectedAsRecipient = false, ItsMe = false, banned = false, password = "1" },
                  new User { userid = 101, UserGid = 10, NickName = "Administrator", NickColor = "#ffffff", MsgColor = "#ffffff", SelectedAsRecipient = false, ItsMe = false, banned = false, password = "1" },
                  new User { userid = 102, UserGid = 80, NickName = "Даня", NickColor = "#ff0000", MsgColor = "#ff0000", SelectedAsRecipient = false, ItsMe = false, banned = false, password = "1" },
                  new User { userid = 103, UserGid = 80, NickName = "Martin", NickColor = "#00ff00", MsgColor = "#00ff00", SelectedAsRecipient = false, ItsMe = false, banned = false, password = "1" }
                );
            
        }
    }
}
