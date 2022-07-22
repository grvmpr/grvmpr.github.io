<Query Kind="Program" />

void Main()
{
	/*
    Get new map tiers when GGG makes the post containing [Item Filter Information] like the one below:
	https://www.pathofexile.com/forum/view-thread/3265282/page/1

	Copy
	---------------------------------------------------
	Tier 1

	    Underground Sea
	    ...
		
	Tier 16

	    Lava Lake
	    ...
	---------------------------------------------------

    INTO a local text file [tiers.txt]
    RUN Linqpad pointing to [tiers.txt]
    COPY results into [tiers.json] and commit repo

	*/
	
	var input = System.IO.File.ReadAllLines(@"C:\Drop\tiers.txt").Where(p => p.Length > 1).ToList();
    var tier = 0;

    var lst = new List<string>();
    var index = 1;
    var sb = new StringBuilder();

    foreach (var item in input)
    {
        if (item.StartsWith("Tier"))
        {
            tier = int.Parse(item.Replace("Tier", "").Trim());
        }
        else
        {
            var comma = index == 1 ? "" : ",";
            sb.Append(comma + @"{""Name"": ""_Name_"",""Id"": _Id_,""Tier"": _Tier_}"
                .Replace("_Name_", item.Trim())
                .Replace("_Id_", index.ToString())
                .Replace("_Tier_", tier.ToString()));
            index++;
        }
    }

    string jsonString = $"[{sb.ToString()}]";

	jsonString.Dump();
}