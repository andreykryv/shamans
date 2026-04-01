using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace ZdravDom.Pages;

public class IndexModel : PageModel
{
    [BindProperty]
    public string? Name { get; set; }
    [BindProperty]
    public string? Phone { get; set; }
    [BindProperty]
    public string? Service { get; set; }
    [BindProperty]
    public string? Message { get; set; }

    public string? SuccessMessage { get; private set; }

    public void OnGet() { }

    public IActionResult OnPost()
    {
        if (!ModelState.IsValid)
            return Page();

        // TODO: подключите здесь EmailService или CRM-интеграцию
        // Например: await _emailService.SendAsync(Name, Phone, Service, Message);

        SuccessMessage = "Заявка принята!";
        return Page();
    }
}
