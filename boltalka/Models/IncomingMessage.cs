namespace boltalka.Models
{
    public class IncomingMessage
    {
        public string ConnectionId { get; set; }
        public int? receiverId { get; set; }
        public bool prvMsg { get; set; }
        public int instruction { get; set; }
        public string message { get; set; }
    }
}