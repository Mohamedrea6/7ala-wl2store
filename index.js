const FiveMAPI = require("./fivem-api");
const {
  Client,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ActivityType,
} = require("discord.js");
const config = require("./config.json");

class FiveMBot {
  constructor() {
    this.bot = new Client({
      intents: [GatewayIntentBits.Guilds],
      partials: [Partials.Channel],
    });
    this.server = new FiveMAPI(config.SERVER_URL);
    this.statusMessage = null;
  }

  async init() {
    try {
      this.bot.once("ready", () => {
        this.updateServerStatus();
        setInterval(
          () => this.updateServerStatus(),
          60000 * config.updateMinutes,
        );
      });
      this.bot.login(config.token);
    } catch (error) {
      console.error("Error during bot initialization: ", error);
    }
  }

  async fetchServerData() {
    try {
      const [status, players, ServerInfo] = await Promise.all([
        this.server.getServerStatus(),
        this.server.getPlayers(),
        this.server.getServerInfo(),
      ]);
      if (status) {
        this.bot.user.setActivity({
          name: " مقاطعة سبيشل",
          type: ActivityType.يلعب,
        });
      }
      return { status, players, ServerInfo };
    } catch (error) {
      console.error("Error fetching server data: ", error);
      return null;
    }
  }

  async updateServerStatus() {
    const serverData = await this.fetchServerData();
    if (!serverData) {
      console.log("Failed to fetch server data.");
      return;
    }
    const {
      embed: statusEmbed,
      Attachment,
      component,
    } = this.createServerStatusEmbed(serverData);
    const channel = this.bot.channels.cache.get(config.CHANNEL_ID);

    if (!channel) {
      console.error("Channel not found");
      return;
    }

    if (!this.statusMessage) {
      try {
        const button = new ActionRowBuilder().addComponents(component);
        const message = await channel.send({
          embeds: [statusEmbed],
          components: [button],
          files: [Attachment],
          content: " ",
        });
        this.statusMessage = message;
      } catch (error) {
        console.error("Error sending status message: ", error);
      }
    } else {
      try {
        const button = new ActionRowBuilder().addComponents(component);
        await this.statusMessage.edit({
          embeds: [statusEmbed],
          components: [button],
          files: [Attachment],
          content: " ",
        });
      } catch (error) {
        console.error("Error updating status message: ", error);
      }
    }
  }

  createServerStatusEmbed({ status, players, ServerInfo }) {
    const statusEmoji = status ? "🟢" : "🔴";
    const statusText = status ? "اونلاين" : "اوفلاين";
    const serverName = ServerInfo?.vars?.sv_projectName;
    return {
      embed: new EmbedBuilder()
        .setColor("#0bf44e")
        .setTitle(`**مقاطعة سبيشل**`)
        .setThumbnail("attachment://icon.png")
        .addFields(
          {
            name: 
            "᲼\n\معلومات الاعبين",
            value: `**👥 ${status ? players.length : "0"} / ${
              ServerInfo?.vars?.sv_maxClients
            }**`,
            inline: true,
          },
          {
            name: 
            "᲼\n\ حالة السيرفر",
            value: `**${statusEmoji} ${statusText}**`,
            inline: true,
          },
          {
            name: 
            "᲼\n\ دخول السيرفر ",
            value: `**connect allxr3**`,
            inline: false,
          },
          {
            name: 
            "᲼\n\ رابط المتجر ",
            value: " **[ اضغط هنا](https://discord.com/channels/1277781336156799026/1277781336937074858)**",
            inline: false,
          },
          {
            name: 
            "᲼\n\  تنبيهات هامة",
            value: ` **يرجى ربط الحسابات التالية لدخول السيرفر:
* Discord
* Steam** `,
            inline: false,
          },
          {
            name: 
            "᲼\n\  🔗 روابط دخول مفاطعة سبيشل  ",
            value: " **[ اضغط هنا](https:/cfx.re/join/allxr3)**",
            inline: false,
          },
          
        )
        .setFooter({ text: "اخر تحديث" })
        .setTimestamp(),
      Attachment: new AttachmentBuilder(
        ServerInfo?.icon
        ? Buffer.from(ServerInfo.icon, "base64")
        : Buffer.from("YourDefaultIcon", "utf-8"),
      { name: "icon.png" }
      ),
      component: new ButtonBuilder()
        .setLabel("دخول السيرفر")
        .setURL(config.DIRECT_CONNECT_LINK)
        .setStyle(ButtonStyle.Link),

        
    };
  }
}

const bot = new FiveMBot();
bot.init();


//BOT BY WL2 STORE discord.gg/wl2