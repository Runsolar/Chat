using System.Data.Entity;

namespace boltalka.Models
{
    public class User
    {
        public int userid { get; set; }
        public int UserGid { get; set; }
        public int Room { get; set; }
        public string Email { get; set; }
        public string RegistrationDate { get; set; }
        public string ConnectionId { get; set; }
        public string NickName { get; set; }
        public string NickColor { get; set; }
        public string MsgColor { get; set; }
        public bool SelectedAsRecipient { get; set; }
        public bool ItsMe { get; set; }
        public bool banned { get; set; }
        public bool prisoner { get; set; }
        public string password { get; set; }
    }

    public class UserDBContext : DbContext
    {

        public UserDBContext() : base("name=UserDBContext")
        {
            Database.SetInitializer<UserDBContext>(new UserDbInitializer());
        }

        public DbSet<User> Users { get; set; }
    }

    public class UserDbInitializer : DropCreateDatabaseIfModelChanges<UserDBContext>
    {
        protected override void Seed(UserDBContext db)
        {
            db.Users.Add(
                new User { userid = 0, UserGid = 0, NickName = "Doorman", NickColor = "#ffffff", MsgColor = "#ffffff", SelectedAsRecipient = false, ItsMe = false, banned = false, password = "1" }
            );
            db.Users.Add(
                new User { userid = 100, UserGid = 10, NickName = "Администратор", NickColor = "#ffffff", MsgColor = "#ffffff", SelectedAsRecipient = false, ItsMe = false, banned = false, password = "1" }
            );
            db.Users.Add(
               new User { userid = 101, UserGid = 10, NickName = "Administrator", NickColor = "#ffffff", MsgColor = "#ffffff", SelectedAsRecipient = false, ItsMe = false, banned = false, password = "1" }
               );
            db.Users.Add(
                new User { userid = 102, UserGid = 80, NickName = "Вася", NickColor = "#ff0000", MsgColor = "#ff0000", SelectedAsRecipient = false, ItsMe = false, banned = false, password = "1" }
            );

            db.Users.Add(
                new User { userid = 103, UserGid = 80, NickName = "Петя", NickColor = "#00ff00", MsgColor = "#00ff00", SelectedAsRecipient = false, ItsMe = false, banned = false, password = "1" }
            );
            /*
                        db.Users.Add(
                            new User { userid = 300, UserGid = 80, NickName = "Дима", NickColor = "#ffff00", MsgColor = "#ffff00", SelectedAsRecipient = false, ItsMe = false, banned = false, password = "1" }
                        );
                        db.Users.Add(
                            new User { userid = 400, UserGid = 80, NickName = "Саша", NickColor = "#996633", MsgColor = "#996633", SelectedAsRecipient = false, ItsMe = false, banned = false, password = "1" }
                        );
                        db.Users.Add(
                            new User { userid = 500, UserGid = 80, NickName = "Маша", NickColor = "#9900cc", MsgColor = "#9900cc", SelectedAsRecipient = false, ItsMe = false, banned = false, password = "1" }
                        );
                        db.Users.Add(
                            new User { userid = 600, UserGid = 80, NickName = "Нина", NickColor = "#ff0066", MsgColor = "#ff0066", SelectedAsRecipient = false, ItsMe = false, banned = false, password = "1" }
                        );
                        db.Users.Add(
                            new User { userid = 700, UserGid = 80, NickName = "Даша", NickColor = "#66ccff", MsgColor = "#66ccff", SelectedAsRecipient = false, ItsMe = false, banned = false, password = "1" }
                        );
                        db.Users.Add(
                            new User { userid = 800, UserGid = 80, NickName = "Никита", NickColor = "#ffffff", MsgColor = "#ffffff", SelectedAsRecipient = false, ItsMe = false, banned = false, password = "1" }
                        );
                        db.Users.Add(
                            new User { userid = 900, UserGid = 10, NickName = "Администратор", NickColor = "#ffffff", MsgColor = "#ffffff", SelectedAsRecipient = false, ItsMe = false, banned = false, password = "1" }
                        );
                        db.Users.Add(
                            new User { userid = 901, UserGid = 10, NickName = "8888888888888", NickColor = "#ffffff", MsgColor = "#ffffff", SelectedAsRecipient = false, ItsMe = false, banned = false, password = "1" }
                        );
                        */
            base.Seed(db);
        }
    }

}