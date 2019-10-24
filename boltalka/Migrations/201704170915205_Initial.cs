namespace boltalka.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Users",
                c => new
                    {
                        userid = c.Int(nullable: false, identity: true),
                        UserGid = c.Int(nullable: false),
                        Room = c.Int(nullable: false),
                        Email = c.String(),
                        RegistrationDate = c.String(),
                        ConnectionId = c.String(),
                        NickName = c.String(),
                        NickColor = c.String(),
                        MsgColor = c.String(),
                        SelectedAsRecipient = c.Boolean(nullable: false),
                        ItsMe = c.Boolean(nullable: false),
                        banned = c.Boolean(nullable: false),
                        prisoner = c.Boolean(nullable: false),
                        password = c.String(),
                    })
                .PrimaryKey(t => t.userid);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.Users");
        }
    }
}
