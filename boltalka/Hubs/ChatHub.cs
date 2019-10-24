using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using boltalka.Models;
using System.IO;

namespace boltalka.Hubs
{
    public class ChatHub : Hub
    {
        //База пользователей
        private UserDBContext db = new UserDBContext();
        /*
                static List<User> Users = new List<User>()
                {
                    new User { userid = 0, UserGid = 0, NickName = "Швейцар", NickColor="#ffffff", MsgColor="#ffffff", SelectedAsRecipient = false, ItsMe = false, banned=false, password="1"},
                    new User { userid=100, UserGid=80, NickName= "Вася", NickColor= "#ff0000", MsgColor= "#ff0000", SelectedAsRecipient = false, ItsMe = false, banned=false, password= "1" },
                    new User { userid= 200, UserGid= 80, NickName= "Петя", NickColor= "#00ff00", MsgColor= "#00ff00", SelectedAsRecipient = false, ItsMe = false, banned=false, password= "1" },
                    new User { userid= 300, UserGid= 80, NickName= "Дима", NickColor= "#ffff00", MsgColor= "#ffff00", SelectedAsRecipient = false, ItsMe = false, banned=false, password= "1" },
                    new User { userid= 400, UserGid= 80, NickName= "Саша", NickColor= "#996633", MsgColor= "#996633", SelectedAsRecipient = false, ItsMe = false, banned=false, password= "1" },
                    new User { userid= 500, UserGid= 80, NickName= "Маша", NickColor= "#9900cc", MsgColor= "#9900cc", SelectedAsRecipient = false, ItsMe = false, banned=false, password= "1" },
                    new User { userid= 600, UserGid= 80, NickName= "Нина", NickColor= "#ff0066", MsgColor= "#ff0066", SelectedAsRecipient = false, ItsMe = false, banned=false, password= "1" },
                    new User { userid= 700, UserGid=80, NickName= "Даша", NickColor= "#66ccff", MsgColor= "#66ccff", SelectedAsRecipient = false, ItsMe = false, banned=false, password= "1" },
                    new User { userid= 800, UserGid= 80, NickName="Никита", NickColor= "#ffffff", MsgColor="#ffffff", SelectedAsRecipient = false, ItsMe = false, banned=false, password= "1" },
                    new User { userid= 900, UserGid= 10, NickName="Администратор", NickColor= "#ffffff", MsgColor="#ffffff", SelectedAsRecipient = false, ItsMe = false, banned=false, password= "1" },
                    new User { userid= 901, UserGid= 10, NickName="8888888888888", NickColor= "#ffffff", MsgColor="#ffffff", SelectedAsRecipient = false, ItsMe = false, banned=false, password= "1" }
                };
        */
        //Кто онлайн
        static List<User> UsersOnline = new List<User>()
        {
            new User { userid = 0, UserGid = 0, NickName = "Doorman", NickColor="#ffffff", MsgColor="#ffffff",
                SelectedAsRecipient = false, ItsMe = false, banned=false, password="", ConnectionId="Doorman-0000-0110-0000-100000000001"},
            //new User { userid=100, UserGid=80, NickName= "Вася", NickColor= "#ff0000", MsgColor= "#ff0000", SelectedAsRecipient = false, ItsMe = false, banned=false, password= "1" },
            //new User { userid= 200, UserGid= 80, NickName= "Петя", NickColor= "#00ff00", MsgColor= "#00ff00", SelectedAsRecipient = false, ItsMe = false, banned=false, password= "1" },
            //new User { userid= 300, UserGid= 80, NickName= "Дима", NickColor= "#ffff00", MsgColor= "#ffff00", SelectedAsRecipient = false, ItsMe = false, banned=false, password= "1" },
            //new User { userid= 400, UserGid= 80, NickName= "Саша", NickColor= "#996633", MsgColor= "#996633", SelectedAsRecipient = false, ItsMe = false, banned=false, password= "1" },
            //new User { userid= 500, UserGid= 80, NickName= "Маша", NickColor= "#9900cc", MsgColor= "#9900cc", SelectedAsRecipient = false, ItsMe = false, banned=false, password= "1" },
            //new User { userid= 600, UserGid= 80, NickName= "Нина", NickColor= "#ff0066", MsgColor= "#ff0066", SelectedAsRecipient = false, ItsMe = false, banned=false, password= "1" },
            //new User { userid= 700, UserGid=80, NickName= "Даша", NickColor= "#66ccff", MsgColor= "#66ccff", SelectedAsRecipient = false, ItsMe = false, banned=false, password= "1" }
        };

        //Коллекция для хранения последних N сообщений
        static int MAXLASTOUTMSG = 64;
        static List<OutboundMessage> LastOutboundMessages = new List<OutboundMessage>(MAXLASTOUTMSG);

/*
        public void Getusersonlinelist()
        {
            Clients.Caller.usersOnlineList(UsersOnline);
        }
*/
        public bool Send(IncomingMessage inMessage)
        {

            User Sender = UsersOnline.FirstOrDefault(u => u.ConnectionId == inMessage.ConnectionId);
            User Receiver = UsersOnline.FirstOrDefault(u => u.userid == inMessage.receiverId);

            OutboundMessage outMessage = new OutboundMessage();
/*
            StreamWriter sw = new StreamWriter(System.AppDomain.CurrentDomain.BaseDirectory + @"IncomingMessage.txt", true);
            sw.WriteLine(DateTime.Now + "   " + inMessage.ConnectionId + "    " + "  " + inMessage.receiverId + "    " + inMessage.message + "   " + Receiver);
            sw.Close();
*/

            if (Sender == null) return false;
            if (Receiver == null)
            {
                if(Sender.UserGid == 80)
                {
                    //User search
                    if (inMessage.instruction == 1)
                    {
                        var UsersOfline = new List<User>();
                        UsersOfline = db.Users.Where(u => u.NickName.StartsWith(inMessage.message) && u.NickName != "Doorman" 
                        && u.NickName != "Администратор" && u.NickName != "Administrator" && u.NickName != "Даня").ToList();
                        for (int n=0; n<UsersOfline.Count; n++)
                        {
                            UsersOfline[n].password = "";
                        }

                        Clients.Caller.UsersOfflineList(UsersOfline); //Отпрвляем найденых пользователей

                        return true;
                    }
                }

                if (Sender.UserGid == 10)
                {
                    //User search
                    if (inMessage.instruction == 1)
                    {
                        var UsersOfline = new List<User>();
                        if(inMessage.message.Length < 14)
                        {
                            UsersOfline = db.Users.Where((u) => u.NickName.StartsWith(inMessage.message)).ToList();
                            //Отпрвляем найденых пользователей
                            Clients.Caller.UsersOfflineList(UsersOfline);
                            return true;
                        }

                        return false;
                    }

                    //Delete msg
                    if (inMessage.instruction == 3)
                    {
                        if (inMessage.message.Length < 32)
                        {
                            OutboundMessage deleteMsg = LastOutboundMessages.FirstOrDefault(u => u.msgId == inMessage.message);
                            if(deleteMsg != null)
                            {
                                LastOutboundMessages.Remove(deleteMsg);
                                Clients.All.deletemsg(inMessage.message);
                                return true;
                            }

                        }
                        return false;
                    }

                    //User ban
                    if (inMessage.instruction == 11)
                    {
                        User userproc = db.Users.FirstOrDefault(u => u.NickName == inMessage.message);

                        if (userproc != null)
                        {
                            db.Users.FirstOrDefault(u => u.NickName == userproc.NickName).banned = true;
                            db.SaveChanges();
                        } 
                        else return false;

                        return true;
                    }

                    //User unban
                    if (inMessage.instruction == 12)
                    {
                        User userproc = db.Users.FirstOrDefault(u => u.NickName == inMessage.message);

                        if (userproc != null)
                        {
                            db.Users.FirstOrDefault(u => u.NickName == userproc.NickName).banned = false;
                            db.SaveChanges();
                        }
                        else return false;

                        return true;
                    }
                }

                return false;
            }

            if (inMessage.instruction == 0)
            {
                outMessage.msgId = Sender.NickName + DateTime.Now.ToString("yyyyMMddHHmmss");
                outMessage.senderId = Sender.userid;
                outMessage.time = DateTime.Now.ToString("hh:mm");
                outMessage.senderNickName = Sender.NickName;
                outMessage.senderNickColor = Sender.NickColor;

                outMessage.receiverId = Receiver.userid;
                outMessage.receiverNickName = Receiver.NickName;
                outMessage.receiverNickColor = Receiver.NickColor;

                outMessage.prvMsg = inMessage.prvMsg;
                outMessage.MsgColor = Sender.MsgColor;
                outMessage.message = inMessage.message;


                if (!outMessage.prvMsg)
                {
                    if (LastOutboundMessages.Count < MAXLASTOUTMSG) LastOutboundMessages.Add(outMessage);
                    else
                    {
                        for (int i = 0; i < MAXLASTOUTMSG - 1; i++)
                        {
                            LastOutboundMessages[i] = LastOutboundMessages[i + 1];
                        }
                        LastOutboundMessages[MAXLASTOUTMSG - 1] = outMessage;
                    }
                }

                if (outMessage.prvMsg)
                {
                    Clients.Caller.addMessage(outMessage);
                    if (Sender.ConnectionId != Receiver.ConnectionId)
                        Clients.Client(Receiver.ConnectionId).addMessage(outMessage);
                }
                else
                {
                    Clients.All.broadcastMessage(outMessage);
                }
            }

            return true;
        }

        // Подключение нового пользователя
        public bool connect(string userName, string userPassword)
        {

            User user = db.Users.FirstOrDefault(u => u.NickName == userName && u.password == userPassword);
            var ConnectionId = Context.ConnectionId;

            if (user == null)
            {
                //Отпрвляем кто онлайн
                Clients.Caller.onConnectedUsersOnlineList(UsersOnline);
                //Отправляем список последних сообщений
                Clients.Caller.onConnectedLastOutboundMessages(LastOutboundMessages);

                return true;
            }
            else if( user.banned == true)
            {
                return false;
            }
            else if(UsersOnline.Any(x => x.ConnectionId == ConnectionId))
            {
                return false;
            }
            else if(UsersOnline.Any(x => x.NickName == db.Users.FirstOrDefault(u => u.NickName == userName).NickName))
            {
                return false;
            }
            else
            {
                User NewUser = new User()
                {
                    ConnectionId = ConnectionId,
                    userid = user.userid,
                    UserGid = user.UserGid,
                    NickName = user.NickName,
                    NickColor = user.NickColor,
                    MsgColor = user.MsgColor,
                    password = ""
                };

                //Добавляем нового пользователя в юзерлист
                UsersOnline.Add(NewUser);

                // Посылаем сообщение текущему пользователю об его авторизации
                Clients.Caller.onConnectedUserIsLoggedIn(NewUser);

                //ID соединения отправляем только владельцу
                NewUser.ConnectionId = null;
                // Посылаем сообщение всем пользователям, кроме текущего
                Clients.AllExcept(ConnectionId).onNewUserConnected(NewUser);
                NewUser.ConnectionId = ConnectionId;

                //Пользователь зашел в ЧАТ
                IncomingMessage inMessage = new IncomingMessage();
                inMessage.ConnectionId = UsersOnline.FirstOrDefault(x => x.NickName == "Doorman").ConnectionId;
                inMessage.receiverId = 0;
                inMessage.message = NewUser.NickName + ", welcome to the Boltalka!";
                inMessage.prvMsg = false;
                Send(inMessage);
            }

            return true;
        }

        // Отключение пользователя
        public override System.Threading.Tasks.Task OnDisconnected(bool stopCalled)
        {
            var item = UsersOnline.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
            if (item != null)
            {
                UsersOnline.Remove(item);
                var id = Context.ConnectionId;
                Clients.All.onUserDisconnected(item.NickName);

                //Пользователь покинул ЧАТ
                IncomingMessage inMessage = new IncomingMessage();
                inMessage.ConnectionId = UsersOnline.FirstOrDefault(x => x.NickName == "Doorman").ConnectionId;
                inMessage.receiverId = 0;
                inMessage.message = item.NickName + ", see you soon!";
                inMessage.prvMsg = false;
                Send(inMessage);
            }

            return base.OnDisconnected(stopCalled);
        }

        public int registernewuser(UserRegInfo NewUserRegInfo)
        {
            if (!(NewUserRegInfo.userNickName.Length > 2) &&
                !(NewUserRegInfo.userNickName.Length < 14) &&
                !(NewUserRegInfo.userPassword.Length > 2) &&
                !(NewUserRegInfo.userPassword.Length < 17) &&
                !(NewUserRegInfo.selectedNickColorValue.Length == 7) &&
                !(NewUserRegInfo.selectedMsgColorValue.Length == 7) &&
                !(NewUserRegInfo.email.Length > 32))
            {
                Clients.Caller.onNewUserRegistrationErrorIncorrectRegInfo();
                return -1;
            }

            User user = db.Users.FirstOrDefault(u => u.NickName == NewUserRegInfo.userNickName);

            if (user != null)
            {
                Clients.Caller.onNewUserRegistrationErrorUserAllreadyRegistred();
                return -1;
            }

            int MaxUserId = db.Users.Max(x => x.userid);

            User NewUserReg = new User()
            {
                userid = MaxUserId + 1,
                UserGid = 80,
                Room = 1,
                Email = NewUserRegInfo.email,
                RegistrationDate = DateTime.Now.ToString("dd.MM.yyyy:HH.mm.ss"),
                ConnectionId = "0000",
                NickName = NewUserRegInfo.userNickName,
                NickColor = NewUserRegInfo.selectedNickColorValue,
                MsgColor = NewUserRegInfo.selectedMsgColorValue,
                SelectedAsRecipient = false,
                ItsMe = false,
                banned = false,
                prisoner = false,
                password = NewUserRegInfo.userPassword
            };

            db.Users.Add(NewUserReg);
            db.SaveChanges();

            Clients.Caller.onNewUserRegistrationSuccess();

            return 0;
        }



    }
}