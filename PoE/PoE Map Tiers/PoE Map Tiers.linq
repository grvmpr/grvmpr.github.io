void Main()
{
	/*
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
	*/
	
	var input = System.IO.File.ReadAllLines(@"H:\My Drive\Source\github\grvmpr.github.io\PoE\PoE Map Tiers\tiers.txt").Where(p => p.Length > 1).ToList();
	//input.Dump();
    var tier = 0;
    var index = 1;
    var sb = new StringBuilder();

    foreach (var item in input)
    {
        if (item.Trim().StartsWith("Tier"))
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
	var outputFile = @"H:\My Drive\Source\github\grvmpr.github.io\tiers.json";
	System.IO.File.WriteAllText (outputFile, jsonString);
	jsonString.Dump();
}